# LSTM for sequence classification in the IMDB dataset
import numpy as np
from keras.layers import Dense
from keras.layers import LSTM
from keras.models import Sequential
from tensorflow import set_random_seed

# https://machinelearningmastery.com/reproducible-results-neural-networks-keras/
# 尽可能减少随机程度，但是使用cuDNN等还是会引入随机性
np.random.seed(0)
set_random_seed(0)

layers = 1
classes = 3


def get_one_hot(targets, nb_classes):
    return np.eye(nb_classes)[np.array(targets).reshape(-1)]


def mapTo3dArray(param):
    new_obj = np.empty((param.shape[0], param.shape[1], 145), np.float32)

    for x in range(param.shape[0]):
        for y in range(param.shape[1]):
            split = str(param[x][y]).split("|")
            for z in range(len(split)):
                new_obj[x][y][z] = float(split[z])

    return new_obj


def load_data():
    TRAIN_DATA = np.genfromtxt('TRAIN.csv', delimiter=',', dtype='str',
                               usecols=np.arange(0, 64), filling_values="")
    TEST_DATA = np.genfromtxt('TEST.csv', delimiter=',', dtype='str',
                              usecols=np.arange(0, 64), filling_values="")

    X_train = mapTo3dArray(TRAIN_DATA[:, 1:])
    X_test = mapTo3dArray(TEST_DATA[:, 1:])

    y_train = get_one_hot(TRAIN_DATA[:, 0].astype(np.int), classes)
    y_test = get_one_hot(TEST_DATA[:, 0].astype(np.int), classes)
    return X_train, X_test, y_train, y_test


X_train, X_test, y_train, y_test = load_data()

model = Sequential()
for layer in range(layers):
    model.add(LSTM(
        300,
        dropout=0.1,
        batch_input_shape=(None, 63, 145),
    ))
model.add(Dense(classes, activation='softmax'))
model.compile(loss='categorical_crossentropy', optimizer="adam", metrics=['acc'])

model.fit(X_train, y_train, epochs=30, batch_size=64)

# Final evaluation of the model
scores = model.evaluate(X_test, y_test, verbose=0)
print(model.summary())
print("Accuracy: %.2f%%" % (scores[1] * 100))

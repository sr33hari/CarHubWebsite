# import the necessary packages
import json
import os
import random
import sys

import cv2 as cv
import keras.backend as K
import numpy as np
import scipy.io

from utils import load_model

if __name__ == '__main__':
    img_width, img_height = 224, 224
    model = load_model()
    model.load_weights('models/model.96-0.89.hdf5')

    cars_meta = scipy.io.loadmat('Car-Recognition/devkit/cars_meta')
    class_names = cars_meta['class_names']  # shape=(1, 196)
    class_names = np.transpose(class_names)

    test_path = sys.argv[1]

    results = []

    filename = test_path
    bgr_img = cv.imread(filename)
    bgr_img = cv.resize(bgr_img, (img_width, img_height), cv.INTER_CUBIC)
    rgb_img = cv.cvtColor(bgr_img, cv.COLOR_BGR2RGB)
    rgb_img = np.expand_dims(rgb_img, 0)
    preds = model.predict(rgb_img)
    prob = np.max(preds)
    class_id = np.argmax(preds)
    text = ('Predict: {}, prob: {}'.format(class_names[class_id][0][0], prob))
    results.append({'label': class_names[class_id][0][0], 'prob': '{:.4}'.format(prob)})
    cv.imwrite('images/{}_out.png'.format(1), bgr_img)

    print(str(class_names[class_id][0][0]) + "," + str(prob))

    K.clear_session()

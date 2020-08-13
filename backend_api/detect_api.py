from utils import detector_utils as detector_utils
import cv2
import tensorflow as tf
import datetime
import argparse
import numpy as np
from keras.models import  load_model
import numpy as np
from io import BytesIO

from flask import request, Flask, jsonify
from flask_cors import CORS
import base64
from PIL import Image
import time
start_str = 'data:image/png;base64,'
lens = len(start_str)

def stringToRGB(base64_string):
    if base64_string[:lens] == start_str:
        base64_string= base64_string[lens:]
    imgdata = base64.b64decode(str(base64_string))
    image = Image.open(BytesIO(imgdata))
    return cv2.cvtColor(np.array(image), cv2.COLOR_BGR2RGB)

app = Flask(__name__)
CORS(app)
detection_graph, sess = detector_utils.load_inference_graph('hand_data_model/frozen_inference_graph_final.pb')
graph2,sess2 = detector_utils.load_inference_graph('hand_data_model/lam_final.pb')
SCORE_THRESH = 0.5
TWO_STATE = True
oi = 1
def model2_predict(img,graph,sess,model = None):
    image_size = (224,224)
    img = cv2.resize(src=img, dsize = image_size)
    img_inp = img.reshape(1, 224, 224, 3)
    pred = detector_utils.classifier(img_inp,graph,sess)
    return pred

def movie_controler_predict(imagebase64):
    global oi
    image_np = stringToRGB(imagebase64)
    cv2.imwrite("test/{}.jpg".format(oi),image_np)
    im_height, im_width, channels = image_np.shape
    print(str(im_height),str(im_width))

    boxes, scores,classes,num_hand = detector_utils.detect_objects(image_np,
                                                detection_graph, sess)
    # draw bounding boxes on frame
    img = detector_utils.draw_box_on_image(1,SCORE_THRESH,
                                    scores, boxes, im_width, im_height,
                                    image_np)
    
    x = np.argmax(scores)
    if scores[x] > SCORE_THRESH:
        print('predict')
        a= classes[x]
        if TWO_STATE:
            # img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
            a = model2_predict(img,graph2,sess2)
            label = np.argmax(a)
            print('result            '+str(label))
            print("score:" + str(np.max(a)))
            if np.max(a)>0.5:
                cv2.imwrite("test/{}.jpg".format(str(label)+str(scores[x])),img)
                return label
            else:
                return 5
    return 5
@app.route('/movie_controller', methods=["POST"])
def text_summary():
    start = time.time()
    content = request.get_json()
    imageSrc = content['imageSrc']
    result = movie_controler_predict(imageSrc)
    print("time:" + str(time.time()-start))
    return jsonify({"content":str(result)})

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)

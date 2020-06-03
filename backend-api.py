import numpy as np

from flask import request, Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/movie_controller', methods=["POST"])
def text_summary():
    content = request.get_json()
    imageSrc = content['imageSrc']
    # for i in content:
    #     print(i)
    result = np.random.choice(range(5))
    # result = 'xin chào đức anh'
    print(result)
    return jsonify({"content":str(result)})

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True)


# import requests
# res = requests.post('http://localhost:5000/text_summary', json={"mytext":"trường tiểu. tôi không. tôi có. tôi thường","mode":"d2v"})
# if res.ok:
#     print(res.json())
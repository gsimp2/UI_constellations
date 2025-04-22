from flask import Flask, render_template, request, jsonify, redirect, url_for
from data import constellations
import random

app = Flask(__name__)
learn1 = ["Cassiopeia", "Andromeda", "Aries", "Orion"]
learn2 = ["Perseus", "Pisces", "Taurus", "Triangulum"]
learn3 = ["Auriga", "Cancer", "Canis Minor", "Lacerta"]
learn4 = ["Cepheus", "Aquila", "Cygnus", "Delphinus"]

learn_pages = {
    "1": learn1,
    "2": learn2,
    "3": learn3,
    "4": learn4,
}

learn_start = 0
learn_end = 0

@app.route('/')
def homepage():
    return render_template('homepage.html') 

@app.route('/learn/<page>')
def learn_page(page=None):
    learn_items = [constellations[name] for name in learn_pages[page]]
    return render_template('learn.html',  constellations = learn_items, page=page)

@app.route('/save_learn/<page>', methods=['POST'])
def save_learn(page=None):
    global constellations
    global learn_start
    global learn_end

    json_data = request.get_json()
    if (page == "1"):
        learn_start = json_data["time_entered"]
        print(learn_start)
    elif (page == "4"):
        learn_end = json_data["time_left"]
    click_times = json_data["click_times"]

    for constellation in click_times:
        constellations[constellation]["learn-time"] += click_times[constellation]
    
    return jsonify(constellations = constellations)

@app.route('/quiz/hard')
def quiz_challenge_page():
    return render_template('quiz_hard.html', constellations=constellations)

@app.route('/quiz/easy')
def quiz_easy_page():
    names = list(constellations.keys())
    random.shuffle(names)

    shuffled_constellations = []
    def newListRemove(element, list): return filter(lambda x: x != element, list)

    for name in names:

        _dict = {}
        _dict["name"] = name
        
        list_15 = newListRemove(name, names)
        options = random.sample(set(list_15), 3)
        
        options.append(name)
        random.shuffle(options)

        _dict["options"] = options

        shuffled_constellations.append(_dict)

    return render_template('quiz_easy.html', shuffled_constellations=shuffled_constellations)


@app.route('/quiz/finish')
def quiz_finish_page():
    
    return render_template('quiz_finish.html')


if __name__ == '__main__':
    app.run(debug=True, port=5001)
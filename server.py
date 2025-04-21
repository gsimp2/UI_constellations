from flask import Flask, render_template, request, jsonify, redirect, url_for
from data import constellations

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

@app.route('/')
def homepage():
    return render_template('homepage.html') 

@app.route('/learn/<page>')
def learn_page(page=None):
    learn_items = [constellations[name] for name in learn_pages[page]]
    return render_template('learn.html',  constellations = learn_items, page=page)

@app.route('/quiz/hard')
def quiz_challenge_page():
    return render_template('quiz_hard.html', constellations=constellations)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
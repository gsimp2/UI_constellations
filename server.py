from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from data import constellations
import random

app = Flask(__name__)
learn1 = ["Cassiopeia", "Andromeda", "Aries", "Orion"]
learn2 = ["Perseus", "Pisces", "Taurus", "Triangulum"]
learn3 = ["Auriga", "Cancer", "Canis Minor", "Lacerta"]
learn4 = ["Cepheus", "Aquila", "Cygnus", "Delphinus"]

app.secret_key = '1234'

learn_pages = {
    "1": learn1,
    "2": learn2,
    "3": learn3,
    "4": learn4,
}

quiz_hard_progress = {
    "reordered_constellations": [],
    "current_index": 0,
    "score": 0,
    "answered_questions": 0,
}

learn_start = 0
learn_end = 0
finished_learn = False

@app.route('/disable_quiz/', methods=['POST'])
def disable_quiz():
    global finished_learn
    finished = finished_learn
    return jsonify(finished)

@app.route('/')
def homepage():
    global finished_learn
    return render_template('homepage.html', finished = finished_learn)

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
        learn_end += json_data["time_left"]
    click_times = json_data["click_times"]

    for constellation in click_times:
        constellations[constellation]["learn-time"] += click_times[constellation]
    
    return jsonify(constellations = constellations)

@app.route('/quiz/hard')
def quiz_challenge_page():
    return render_template('quiz_hard.html', constellations=constellations)

@app.route('/quiz/hard/init', methods=['POST'])
def quiz_hard_init():
    global quiz_hard_progress
    
    if len(quiz_hard_progress["reordered_constellations"]) == 0 or quiz_hard_progress["current_index"] >= len(quiz_hard_progress["reordered_constellations"]):
        quiz_hard_progress = {
        "reordered_constellations": [],
        "current_index": 0,
        "score": 0,
        "answered_questions": 0
        }
        
        constellation_names = list(constellations.keys())
        random.shuffle(constellation_names)
        quiz_hard_progress["reordered_constellations"]=constellation_names
    
    total = len(quiz_hard_progress["reordered_constellations"])
    
    current_index = quiz_hard_progress["current_index"]

    current_name = quiz_hard_progress["reordered_constellations"][current_index]
    return jsonify({
        "constellation": constellations[current_name],
        "name": current_name,
        "current_index": current_index,
        "score": quiz_hard_progress["score"],
        "total": total,
        "all_constellation_names": quiz_hard_progress["reordered_constellations"]
    })


@app.route('/quiz/hard/submit', methods=['POST'])
def quiz_hard_submit():
    global quiz_hard_progress
    
    json_data = request.get_json()
    name = json_data["name"]
    user_answer = json_data["answer"]
    is_correct = user_answer.lower() == name.lower()

    quiz_hard_progress["answered_questions"] += 1
    
    if is_correct:
        quiz_hard_progress["score"] += 1
    
    score = quiz_hard_progress["score"]
    total = quiz_hard_progress["answered_questions"]
    
    quiz_hard_progress["current_index"] += 1
    
    if quiz_hard_progress["current_index"] >= len(quiz_hard_progress["reordered_constellations"]):
        return jsonify({
            "complete": True,
            "is_correct": is_correct,
            "correct_answer": name,
            "score": score,
            "total": total
        })
    
    next_index = quiz_hard_progress["current_index"]
    next_constellation = quiz_hard_progress["reordered_constellations"][next_index]
    
    return jsonify({
        "complete": False,
        "is_correct": is_correct,
        "correct_answer": name,
        "score": score,
        "total": total,
        "next": {
            "constellation": constellations[next_constellation],
            "name": next_constellation,
            "current_index": next_index,
            "total_constellations": len(quiz_hard_progress["reordered_constellations"])
        }
    })

@app.route('/quiz/hard/reset', methods=['POST'])
def quiz_hard_reset():
    global quiz_hard_progress
    
    quiz_hard_progress = {
        "reordered_constellations": [],
        "current_index": 0,
        "score": 0,
        "answered_questions": 0
    }
    
    return jsonify({"reset": True})

@app.route('/quiz/easy/<round>')
def quiz_easy_page(round=None):
    if (round == "1"):
        names = learn1 + learn2
    else:
        names = learn3 + learn4
    print(names)
    random.shuffle(names)

    shuffled_constellations = []

    for name in names:

        _dict = {}
        _dict["name"] = name
        _dict["message"] = constellations[name]["message"]
                
        other_names = [n for n in names if n != name]
        options = random.sample(other_names, 3)
        
        options.append(name)
        random.shuffle(options)

        _dict["options"] = options

        shuffled_constellations.append(_dict)

    return render_template('quiz_easy.html', shuffled_constellations=shuffled_constellations, round=round)


@app.route('/quiz/submit-score', methods=['POST'])
def submit_score():
    data = request.get_json()
    score = data['score']
    round = data['round']
    

    # Save the score temporarily into the Flask session
    session['score'] = score

    # Redirect to finish page
    return redirect(url_for('quiz_finish_page', round=round))

@app.route('/quiz/finish/<round>')
def quiz_finish_page(round=None):
    global finished_learn
    if (round == "2"):
        finished_learn = True
    score = session.get('score')
    print(score)

    if score is None:
        # If somehow accessed /quiz/finish without a score
        return redirect(url_for('quiz_easy_page'))

    return render_template('quiz_finish.html', score=score, round=round)

@app.route('/quiz/start/<round>')
def quiz_start_page(round=None):
    return render_template('quiz_start.html', round=round)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
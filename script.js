
let rightAns,
    rightNumber = 0;
falseNumber = 0;
const clear = document.getElementById("clear");
let falseNumberFromLocalStorage;
let rightNumberFromLocalStorage;
document.addEventListener('DOMContentLoaded', function () {
    AddQuestion();
    evenListeners();

});

// attendre l'evenement du click sur le boutton check afin d'activer la fonction validateAnswer, qui permet de valider ou non la reponse //
evenListeners = () => {
    document.querySelector('#check').addEventListener('click', validateAnswer);
}

AddQuestion = () => {
    const url = ' https://opentdb.com/api.php?amount=1';
    fetch(url)
        //recuperation de l'api sous forme de JSON
        .then(data => data.json())
        // nous allons attribuer a resp les resultats collectés au niveau de l'api
        .then(resp => showQuestion(resp.results));

}
const questionHTML = document.createElement('div');
questionHTML.classList.add('col-12');
// la fonction qui permet d'afficher les questions
showQuestion = questions => {
    
 
   rightNumberFromLocalStorage = JSON.parse(localStorage.getItem("rightNumber"));
   falseNumberFromLocalStorage = JSON.parse(localStorage.getItem("falseNumber"));
    
    questions.forEach(question => {
        console.log(question);
        //declare que rightAns est la bonne reponse
        rightAns = question.correct_answer;

        let possibleAns = question.incorrect_answers;
        //splice 
        possibleAns.splice(Math.floor(Math.random() * 3), 0, rightAns);
        //console.log(question.difficulty);

        questionHTML.innerHTML = `
           
            <div class= "row  justify-content-between heading">
            <p class= "category text-primary">Category:${question.category}</p>
            <p class= "difficulty text-darken">Difficulty:${question.difficulty}</p>
            <div class="scores">
            <span class="badge badge-primary">${rightNumberFromLocalStorage}</span>
            <span class="badge badge-warning">${falseNumberFromLocalStorage}</span>
            </div>
            <div>
            <h2 class="text-center">${question.question}</h2>
            </div>
            </div>
        `

        const answerDiv = document.createElement('div');
        answerDiv.classList.add('questions', 'row', 'justify-content-around', 'mt-5');
        possibleAns.forEach(answer => {
            const answerHTML = document.createElement('li');
            answerHTML.classList.add('col-12', 'col-md-5');
            answerHTML.textContent = answer;

            // pour pouvoir clicker et choisir sa reponse //
            answerHTML.onclick = selectAnswer;




            answerDiv.appendChild(answerHTML);
            //console.log(answer)
        });
        questionHTML.appendChild(answerDiv); // main wrapper //

        document.querySelector('#app').appendChild(questionHTML);
    });
}


selectAnswer = (e) => {
    // if pour pouvoir desactiver le hover sur les autres reponses, le hover doit s'appliquer uniquement sur la reponse ou on a cliqué
    if (document.querySelector('.active')) {
        const activeAnswer = document.querySelector('.active');
        activeAnswer.classList.remove('active');
    }

    //'active' pour activer le hover lorsque l'on clique sur la reponse
    e.target.classList.add('active')
}

// verifier si la reponse est correcte ou pas comme elle est activer avec le click//
validateAnswer = () => {
    if(document.querySelector('.questions .active')){

        verifyAnswer();
    
    } else { // au cas ou on click sur check sans choisir la reponse //
         const errorDiv = document.createElement('div');
         errorDiv.classList.add('alert', 'alert-danger', 'col-md-6');
         errorDiv.textContent = "Please select Answer";
         const questionsDiv = document.querySelector('.questions');
         questionsDiv.appendChild(errorDiv);

         setTimeout(() => { // setTimeout permet au text d'alerte de disparaitre au bout de 2 secondes.
            document.querySelector('.alert-danger').remove();
         }, 2000);
    }
}

verifyAnswer = () => {
    const userAnswer = document.querySelector('.questions .active');
    if(userAnswer.textContent === rightAns) {
        // rightNumber++;
        rightNumberFromLocalStorage ++
        localStorage.setItem("rightNumber", JSON.stringify(rightNumberFromLocalStorage));
    } else {
        //  falseNumber++;
        falseNumberFromLocalStorage++
         localStorage.setItem("falseNumber", JSON.stringify(falseNumberFromLocalStorage));
    }
    //console.log(answer)
const app = document.querySelector('#app');
while(app.firstChild) {
    app.removeChild(app.firstChild);
}
AddQuestion();
} 

clear.addEventListener('click', () => {
    localStorage.clear();
    
    rightNumber = 0;
    falseNumber = 0;
    localStorage.setItem("falseNumber", JSON.stringify(falseNumber));
    localStorage.setItem("rightNumber", JSON.stringify(rightNumber));
    questionHTML.innerHTML =``
    AddQuestion()
    showQuestion()

})
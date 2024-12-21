//^ Global Variables
const categorySelector = document.querySelector("#categoryMenu");
const leveSelector = document.querySelector("#difficultyOptions");
const questionNumberSelector = document.querySelector("#questionsNumber");
const btnSlector = document.querySelector("#startQuiz");
const rowDataSelector = document.querySelector("#rowData");
const formSelector = document.querySelector("#quizOptions");


let allQuestions;
let myQuiz;


async function start() {
  const options = {
    category: categorySelector.value,
    leve: leveSelector.value,
    qnumber: questionNumberSelector.value,
  };

  // create object from  quiz class
  myQuiz = new Quiz(options);

  
  allQuestions = await myQuiz.fetchquestion();
  console.log(allQuestions);

  currentQuestions = new Questions(0);
  console.log(currentQuestions)
  currentQuestions.display();

}

btnSlector.addEventListener("click", start);



class Quiz {
  constructor({ category, leve, qnumber }) {
    this.category = category;
    this.level = leve;
    this.numbers = qnumber;
    this.score = 0;
  }

  // ^ call api
 async fetchquestion ()  {
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${this.numbers}&category=${this.category}&difficulty=${this.level}`
      );
      const data = await response.json();
      formSelector.classList.replace("d-flex", "d-none");
      return data.results;
    } catch (err) {
      console.log("error");
    }
  };


  //^ Finish & try again
  finsh = () => {
    rowDataSelector.innerHTML = `
       <div class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3">
 <h2 class="mb-0 text-center">
     ${
       myQuiz.score === allQuestions.length
         ? "Best Answers 👌.. Congratulations!!⭐"
         : myQuiz.score > 0
         ? `your score is ${myQuiz.score} of ${allQuestions.length} ✌`
         : "Bad Answers😔 .. HardLuck!! "
     }
</h2>
<button  class="again btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
</div>
        `;
    document.querySelector(".again").addEventListener("click", () => {
      location.reload();
    });
  }

}

class Questions{
  constructor(index){
    this.index = index;
    this.question = allQuestions[index].question;
    this.category = allQuestions[index].category;
    this.correct_answer = allQuestions[index].correct_answer;
    this.incorrect_answers = allQuestions[index].incorrect_answers;
    this.allAnswers = [this.correct_answer , this.incorrect_answers].sort();
    this.isAnswered = false; // he didn't answer
  }

  // ^ Display
   display = () => {
    rowDataSelector.innerHTML = `
      <div
           class="question shadow-lg col-md-8 offset-md-2  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
           <div class="w-100 d-flex justify-content-between">
           <span class="btn btn-category">${this.category}</span>
           <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${allQuestions.length} Questions</span>
           </div>
           <h2 class="text-capitalize h4 text-center">${this.question} </h2>
           <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">
                 ${this.allAnswers.map((ele) =>`<li>${ele}</li>`).join("")}
           </ul>
           <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${myQuiz.score}</h2>
           </div>
      </div>`

     //^ To select the li
      const allOptions = document.querySelectorAll('ul li');

      allOptions.forEach((ele) => {
        ele.addEventListener("click", () =>{
          this.checkAnswer(ele);
        })
      });
  };

  //^ To Check the Answer
  checkAnswer = (ele) =>{
    //console.log(ele)
    if(!this.isAnswered){
      this.isAnswered = true; // to let the user select only one time
      if(ele.innerHTML == this.correct_answer){
          ele.classList.add("correct","animate__animated", "animate__heartBeat");
          myQuiz.score++;
      }
      else{
          ele.classList.add("wrong","animate__animated", "animate__shakeX");
      }
      
      setTimeout(()=>{
        this.getNextQuestion();
      },1000)

      
   }
}
     
//^ To Get the next question
getNextQuestion = ()=>{
  this.index++;
  if(this.index < allQuestions.length){
    const nextQues = new Questions(this.index);
    nextQues.display(); // display next question
  }
  else{
    console.log("Finish");
    myQuiz.finsh();
  }
}

}

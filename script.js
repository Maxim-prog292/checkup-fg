const QUESTIONS = [
  {
    text: "Как ты чаще всего распоряжаешься деньгами в начале месяца?",
    answers: [
      "Планирую бюджет и откладываю часть денег сразу",
      "Трачу свободно, надеюсь, что до зарплаты хватит",
      "Вообще не задумываюсь, живу от зарплаты до зарплаты",
    ],
  },
  {
    text: "У тебя есть финансовая подушка безопасности?",
    answers: [
      "Да, есть, я регулярно её пополняю",
      "Что-то есть, но небольшая сумма",
      "Нет, все деньги уходят на текущие расходы",
    ],
  },
  {
    text: "Как ты относишься к кредитам?",
    answers: [
      "Пользуюсь редко и только в крайних случаях, считаю переплату",
      "Пользуюсь иногда, но не считаю проценты",
      "Кредиты - это нормально, беру когда хочется что-то купить",
    ],
  },
  {
    text: "Что ты делаешь, когда видишь товар со скидкой 70%?",
    answers: [
      "Спрашиваю себя: «Мне это нужно или просто дёшево?» и только потом решаю",
      "Покупаю, если вещь вызывает эмоции",
      "Покупаю сразу - скидка же!",
    ],
  },
  {
    text: "Ведёшь ли ты учёт своих доходов и расходов?",
    answers: [
      "Да, записываю всё и анализирую раз в месяц",
      "Иногда записываю, но анализирую редко",
      "Нет, считаю это скучным и бесполезным",
    ],
  },
  {
    text: "Как ты реагируешь на звонок из «банка»?",
    answers: [
      "Вешаю трубку и перезваниваю по официальному номеру",
      "Слушаю, но ничего не сообщаю",
      "Отвечаю на вопросы, если слышу знакомые названия банков",
    ],
  },
  {
    text: "Инвестируешь ли ты свои сбережения?",
    answers: [
      "Да, разбираюсь в инструментах и регулярно вкладываю",
      "Пока нет, но хочу научиться",
      "Нет, не доверяю инвестициям и не понимаю их",
    ],
  },
  {
    text: "Как ты планируешь крупные покупки?",
    answers: [
      "Откладываю заранее, зная, когда и сколько понадобится",
      "Покупаю, когда появляются деньги",
      "Беру кредит или прошу у близких",
    ],
  },
  {
    text: "Знаешь ли ты свои права как потребитель финансовых услуг?",
    answers: [
      "Да, я изучал эту тему и знаю, куда обращаться",
      "Что-то знаю, но не уверен",
      "Нет, не задумывался об этом",
    ],
  },
  {
    text: "Нужно ли учить детей финансовой грамотности?",
    answers: [
      "Да, это один из важнейших навыков в жизни",
      "Это полезно, но не обязательно",
      "Дети должны учиться самостоятельно, когда вырастут",
    ],
  },
];

const RESULT_COPY = {
  champion: {
    eyebrow: "Молодец!",
    title: "Ты - финансовый чемпион!",
    range: "7-10 баллов",
    text: "Отлично! Ты финансово грамотный человек. Ты уже применяешь правильные привычки в жизни. Продолжай в том же духе!",
  },
  steady: {
    eyebrow: "Хорошо!",
    title: "Ты на правильном пути!",
    range: "5-6 баллов",
    text: "Хорошо! Ты на правильном пути, но есть куда расти. Скорректируй пару привычек - и результат не заставит ждать.",
  },
  start: {
    eyebrow: "Незачет!",
    title: "Ты получил незачет? Не беда!",
    range: "0-4 балла",
    text: "Главное - что ты теперь знаешь, куда двигаться. Начни с простого - учёта расходов. И через месяц ты увидишь изменения.",
  },
};

let currentIndex = 0;
let score = 0;
let locked = false;
let inactivityTimer = 0;

const INACTIVITY_TIMEOUT = 90 * 1000;
const app = document.querySelector(".app");
const startPanel = document.getElementById("startPanel");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");
const startButton = document.getElementById("startButton");
const backToStartButton = document.getElementById("backToStartButton");
const restartButton = document.getElementById("restartButton");
const questionCounter = document.getElementById("questionCounter");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const answers = document.getElementById("answers");
const resultVisual = document.getElementById("resultVisual");
const resultEyebrow = document.getElementById("resultEyebrow");
const resultTitle = document.getElementById("resultTitle");
const resultScore = document.getElementById("resultScore");
const resultText = document.getElementById("resultText");

function blockBrowserEvents() {
  ["contextmenu", "selectstart", "dragstart"].forEach((eventName) => {
    document.addEventListener(eventName, (event) => event.preventDefault());
  });

  document.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener("keydown", (event) => {
    const blockedKeys = ["F5", "F11", "F12"];
    const blockedCombo =
      (event.ctrlKey || event.metaKey) &&
      ["a", "c", "p", "r", "s", "u", "+", "-", "0"].includes(
        event.key.toLowerCase(),
      );

    if (blockedKeys.includes(event.key) || blockedCombo) {
      event.preventDefault();
    }
  });
}

function fitApp() {
  const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
  app.style.transform = `scale(${scale})`;
  app.style.marginLeft = `${(window.innerWidth - 1920 * scale) / 2}px`;
  app.style.marginTop = `${(window.innerHeight - 1080 * scale) / 2}px`;
}

function requestFullscreenMode() {
  // Полноэкранный режим задаёт музейная оболочка, а не первое касание посетителя.
}

function resetInactivityTimer() {
  window.clearTimeout(inactivityTimer);

  if (!startPanel.hidden) return;
  inactivityTimer = window.setTimeout(returnToStart, INACTIVITY_TIMEOUT);
}

function startQuiz() {
  requestFullscreenMode();
  currentIndex = 0;
  score = 0;
  locked = false;
  startPanel.hidden = true;
  resultPanel.hidden = true;
  quizPanel.hidden = false;
  renderQuestion();
  resetInactivityTimer();
}

function returnToStart() {
  startQuiz();
}

function renderQuestion() {
  const question = QUESTIONS[currentIndex];
  locked = false;
  questionCounter.textContent = `Вопрос ${currentIndex + 1} из ${QUESTIONS.length}`;
  progressBar.style.width = `${((currentIndex + 1) / QUESTIONS.length) * 100}%`;
  questionText.textContent = question.text;

  answers.innerHTML = question.answers
    .map(
      (answer, index) => `
        <button class="answer-button" type="button" data-index="${index}" data-letter="${index + 1}">
          <span>${answer}</span>
        </button>
      `,
    )
    .join("");

  answers.querySelectorAll(".answer-button").forEach((button) => {
    button.addEventListener("click", () =>
      chooseAnswer(Number(button.dataset.index)),
    );
  });
}

function chooseAnswer(answerIndex) {
  if (locked) return;
  locked = true;
  resetInactivityTimer();

  if (answerIndex === 0) {
    score += 1;
  }

  answers.querySelectorAll(".answer-button").forEach((button) => {
    button.disabled = true;
    button.classList.toggle(
      "is-selected",
      Number(button.dataset.index) === answerIndex,
    );
  });

  window.setTimeout(() => {
    if (currentIndex === QUESTIONS.length - 1) {
      showResult();
      return;
    }

    currentIndex += 1;
    renderQuestion();
  }, 360);
}

function getResultKey() {
  if (score >= 7) return "champion";
  if (score >= 5) return "steady";
  return "start";
}

function showResult() {
  const key = getResultKey();
  const copy = RESULT_COPY[key];
  quizPanel.hidden = true;
  startPanel.hidden = true;
  resultPanel.hidden = false;
  resultVisual.innerHTML = getResultSvg(key);
  resultEyebrow.textContent = copy.eyebrow;
  resultTitle.textContent = copy.title;
  resultScore.textContent = `${score} баллов из ${QUESTIONS.length}`;
  resultText.textContent = copy.text;
  resetInactivityTimer();
}

function getResultSvg(key) {
  if (key === "champion") {
    return `
      <svg viewBox="0 0 760 270" role="img" aria-label="Золотая медаль и звёзды">
        <rect x="0" y="0" width="760" height="270" rx="36" fill="#e7e0d2" opacity="0.5" />
        <path d="M360 62 L388 118 L450 127 L405 171 L416 232 L360 203 L304 232 L315 171 L270 127 L332 118 Z" fill="#d9b352" />
        <circle cx="360" cy="145" r="78" fill="#d9b352" stroke="#004c3d" stroke-width="10" />
        <circle cx="360" cy="145" r="50" fill="#e7e0d2" />
        <path d="M334 145 L353 164 L391 122" fill="none" stroke="#3ebb78" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
        <g fill="#3ebb78">
          <path d="M126 52 L138 82 L170 84 L145 104 L153 136 L126 119 L99 136 L107 104 L82 84 L114 82 Z" />
          <path d="M615 48 L626 74 L654 76 L632 94 L639 122 L615 107 L591 122 L598 94 L576 76 L604 74 Z" />
          <path d="M558 162 L566 181 L587 183 L571 197 L576 218 L558 207 L540 218 L545 197 L529 183 L550 181 Z" />
        </g>
        <text x="380" y="249" fill="#004c3d" font-family="Start Headings, Georgia, serif" font-size="34" text-anchor="middle"></text>
      </svg>
    `;
  }

  if (key === "steady") {
    return `
      <svg viewBox="0 0 760 270" role="img" aria-label="Серебряная медаль и стрелка роста">
        <rect x="0" y="0" width="760" height="270" rx="36" fill="#e7e0d2" opacity="0.5" />
        <circle cx="266" cy="132" r="74" fill="#c9d0cb" stroke="#004c3d" stroke-width="10" />
        <circle cx="266" cy="132" r="45" fill="#e7e0d2" />
        <path d="M245 133 L262 151 L292 111" fill="none" stroke="#3ebb78" stroke-width="13" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M408 185 L480 136 L544 153 L641 70" fill="none" stroke="#3ebb78" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M610 66 L650 62 L644 102" fill="none" stroke="#3ebb78" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" />
        <g fill="#004c3d" opacity="0.18">
          <rect x="408" y="198" width="54" height="34" rx="12" />
          <rect x="488" y="176" width="54" height="56" rx="12" />
          <rect x="568" y="137" width="54" height="95" rx="12" />
        </g>
        <text x="380" y="249" fill="#004c3d" font-family="Start Headings, Georgia, serif" font-size="34" text-anchor="middle"></text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 760 270" role="img" aria-label="Улыбающийся человек с копилкой и монетами">
      <rect x="0" y="0" width="760" height="270" rx="36" fill="#e7e0d2" opacity="0.5" />
      <circle cx="235" cy="92" r="42" fill="#e7e0d2" stroke="#004c3d" stroke-width="8" />
      <path d="M169 218 C178 158 198 130 235 130 C272 130 294 158 302 218 Z" fill="#3ebb78" stroke="#004c3d" stroke-width="8" />
      <path d="M218 91 Q235 108 252 91" fill="none" stroke="#004c3d" stroke-width="7" stroke-linecap="round" />
      <circle cx="220" cy="78" r="5" fill="#004c3d" />
      <circle cx="250" cy="78" r="5" fill="#004c3d" />
      <path d="M340 152 C340 112 387 88 443 99 C472 69 535 91 532 135 C564 149 565 204 522 215 L390 215 C355 211 340 185 340 152 Z" fill="#d97b61" stroke="#004c3d" stroke-width="9" />
      <circle cx="485" cy="137" r="9" fill="#004c3d" />
      <path d="M372 126 L340 105" stroke="#004c3d" stroke-width="8" stroke-linecap="round" />
      <g fill="#d9b352" stroke="#004c3d" stroke-width="5">
        <circle cx="599" cy="92" r="20" />
        <circle cx="638" cy="135" r="17" />
        <circle cx="603" cy="183" r="19" />
        <circle cx="560" cy="48" r="14" />
      </g>
      <text fill="#004c3d" font-family="Start Headings, Georgia, serif" font-size="27" text-anchor="middle">
        <tspan x="380" y="236"></tspan>
        <tspan x="380" y="264"></tspan>
      </text>
    </svg>
  `;
}

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", startQuiz);
backToStartButton.addEventListener("click", returnToStart);
window.addEventListener("resize", fitApp);
document.addEventListener("pointerdown", requestFullscreenMode, { once: true });
["pointerdown", "pointermove", "keydown"].forEach((eventName) => {
  document.addEventListener(eventName, resetInactivityTimer);
});

blockBrowserEvents();
fitApp();
requestFullscreenMode();
startPanel.hidden = true;
startPanel.remove();
startQuiz();
window.ExhibitUI?.mount({ timeout: INACTIVITY_TIMEOUT, reset: startQuiz });

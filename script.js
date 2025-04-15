'use strict'

/* 変数を定義 (ゲーム用以外) */
const introBtn = document.getElementById('introBtn'); // HTMLのID名:introBtn (ナビゲーションバーの自己紹介ボタン)
const gameBtn = document.getElementById('gameBtn'); // HTMLのID名:gameBtn (ナビゲーションバーのゲームボタン)
const introPage = document.getElementById('introPage'); // HTMLのID名:introPage (自己紹介ページ)
const gamePage = document.getElementById('gamePage'); // HTMLのID名:gamePage (ゲームページ)
const imageFolder = 'picture/hobby/'; // 画像フォルダ
const images = [
  'picture1.png',
  'picture2.png',
  'picture3.png',
  'picture4.png',
  'picture5.png',
  'picture6.png',
  'picture7.png',
];
let currentImageIndex = 0;
const photoElement = document.getElementById('photo');

/* 変数を定義 (DOM要素との紐付け等)(ゲーム用の要素) */
const difficultyElement = document.getElementById('difficultySelection')
const startBtn = document.getElementById('startBtn'); // HTMLのID名:stratBtn (ゲーム開始のスタートボタン)
const numberElement = document.getElementById('number'); // HTMLのID名:number (数字を表示)
const answersElement = document.getElementById('answers'); // HTMLのID名:answers (回答入力欄)
const submitBtn = document.getElementById('submitBtn'); // HTMLのID名:submitBtn (回答送信ボタン)
const retryBtn = document.getElementById('retryBtn'); // HTMLのID名:retryBtn (リトライボタン)
const resultElement = document.getElementById('result'); // HTMLのID名:result (結果を表示)
const difficultySettings = { //難易度設定。length：数値の桁数、count：数値の数、time：表示秒数
  easy: { length: 1, count: 3, time: 1000 },
  difficult: { length: 2, count: 5, time: 1000 },
  nightmare: { length: 3, count: 10, time: 300 },
};
let randomNumbers = []; //ランダムに生成した数字の配列
let currentIndex = 0; //randomNumbersのIndex
let displayTime; //数字を表示する時間
let hideTime; //数字を表示しない時間
let totalNumbers; //表示する数字の数
let numberLength; //表示する数字の桁数
let userAnswer; // ユーザーが入力した回答


/* 関数を定義 (ゲーム用以外) */
/* 写真を順番に表示 */
function showNextImage() { // フェードアウト
  photoElement.style.opacity = 0;
  setTimeout(function () { // インデックスを更新
    currentImageIndex = (currentImageIndex + 1) % images.length; // 新しい画像のソースを設定
    photoElement.src = imageFolder + images[currentImageIndex]; // フェードイン
    photoElement.style.opacity = 1;
  }, 1000); // フェードアウトの1秒後に、次の画像を表示
}

function startSlideshow() { // 最初の画像を設定
  photoElement.src = imageFolder + images[currentImageIndex];
  photoElement.style.opacity = 1;
  setInterval(showNextImage, 6000); // 6秒ごとにshowNextImageを実行し画像を切り替え
}


/* 関数を定義 (ゲーム用) */
/* 難易度の桁数に応じたランダムな数字を生成 */
function generateRandomNumber(length) {
  const max = Math.pow(10, length) - 1; // 1桁、2桁、3桁に応じた最大値
  const min = Math.pow(10, length - 1); // 最小値
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* スタートボタンを押した際の関数 */
function startGame() {
  const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked').value; //選択した難易度を変数selectedDifficultyに代入
  const settings = difficultySettings[selectedDifficulty]; //選択した難易度の設定を変数settingsに代入
  displayTime = settings.time; //数字を表示する時間をdisplayTimeに代入
  hideTime = displayTime / 10; //表示する時間の1/10の時間非表示に設定
  totalNumbers = settings.count; //表示する数字の数をtotalNumbersに代入
  numberLength = settings.length; //数字の桁数をnumberLengthに代入
  randomNumbers = []; //変数randomNumbersを初期化
  userAnswer = null; // ユーザーの回答をリセット
  for (let i = 0; i < totalNumbers; i++) { // ランダムな数字を生成
    randomNumbers.push(generateRandomNumber(numberLength));
  }
  currentIndex = 0; //randomNumbersのIndexを初期化
  numberElement.classList.remove('hidden'); // 数字表示エリアを表示
  numberElement.textContent = randomNumbers[currentIndex]; // 最初の数字を表示
  answersElement.classList.add('hidden'); // 回答入力欄を隠す
  resultElement.textContent = ''; //結果に空白を表示
  retryBtn.classList.add('hidden'); // リトライボタンを隠す
  const hideNumber = function () {
    numberElement.textContent = '';
    setTimeout(showNextNumber, hideTime)
  }
  const showNextNumber = function () { // 数字を表示
    if (currentIndex < totalNumbers - 1) {
      currentIndex++;
      numberElement.textContent = randomNumbers[currentIndex];
      setTimeout(hideNumber, displayTime);
    } else {
      numberElement.classList.add('hidden'); // 数字表示エリアを隠す
      showAnswerInput(); // 回答入力欄を表示
    }
  };
  setTimeout(hideNumber, displayTime);
}


/* 回答入力欄を表示する関数 */
function showAnswerInput() {
  answersElement.classList.remove('hidden'); //回答入力欄を表示
  answersElement.querySelector('input').value = ''; //前回回答結果をリセット
  answersElement.querySelector('input').focus(); // 最初の入力フィールドにフォーカス
  submitBtn.classList.remove('hidden'); //送信ボタンを表示
}


/* イベントリスナー (ゲーム用) */
/* スタートボタンを押した際の動作を定義 */
startBtn.addEventListener('click', () => {
  difficultyElement.classList.add('hidden'); // 難易度選択を隠す
  numberElement.classList.remove('hidden'); // 数字表示エリアを表示
  startGame(); // ゲームを開始
});


/* 送信ボタンを押した際の動作を定義 */
submitBtn.addEventListener('click', function () {
  const correctAnswer = randomNumbers.reduce((acc, num) => acc + num, 0); // 合計を計算
  userAnswer = parseInt(answersElement.querySelector('input').value, 10);
  resultElement.innerHTML = ''; // 結果をクリア
  if (userAnswer === correctAnswer) {
    resultElement.innerHTML = `正解！`;
    resultElement.classList.add('correct');
  } else {
    resultElement.innerHTML = `残念！正しい合計は ${correctAnswer} です。`;
    resultElement.classList.add('incorrect');
  }
  submitBtn.classList.add('hidden'); //送信ボタンを隠す
  retryBtn.classList.remove('hidden'); // リトライボタンを表示
});


/* リトライボタンを押した際の動作を定義 */
retryBtn.addEventListener('click', function () {
  difficultyElement.classList.remove('hidden'); //難易度設定を表示
  numberElement.classList.add('hidden'); // 数字表示エリアを隠す
  resultElement.innerHTML = ''; // 結果をクリア
  retryBtn.classList.add('hidden'); // 再試行ボタンを隠す
  answersElement.classList.add('hidden'); // 回答入力欄を隠す
});


/* イベントリスナー (ゲーム用以外) */
/* 自己紹介ボタンを押した際の動作を定義 */
introBtn.addEventListener('click', function () {
  introPage.classList.add('active');
  introPage.classList.remove('hidden');
  gamePage.classList.remove('active');
  gamePage.classList.add('hidden');

});

/* ゲームボタンを押した際の動作を定義 */
gameBtn.addEventListener('click', function () {
  introPage.classList.remove('active');
  introPage.classList.add('hidden');
  gamePage.classList.add('active');
  gamePage.classList.remove('hidden');
  difficultyElement.classList.remove('hidden'); // 難易度選択を表示
  resultElement.innerHTML = ''; // 結果をクリア
  answersElement.classList.add('hidden'); // 回答入力欄を隠す
  submitBtn.classList.add('hidden'); //送信ボタンを隠す
  retryBtn.classList.add('hidden'); // 再試行ボタンを隠す
  numberElement.classList.add('hidden'); // 数字表示エリアを隠す
});


/* 初期設定 */
// 初期状態で自己紹介ページを表示
introPage.classList.add('active');

// ロードした際にstartSlideshowを実行する
window.onload = startSlideshow;

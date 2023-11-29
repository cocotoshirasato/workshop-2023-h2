import fs from "fs";
import dayjs from "dayjs";
import { PythonShell } from "python-shell";
import Tesseract from "tesseract.js";

const challengeTime = 360; // 秒数

const executionTime = dayjs();
const python1_code = "img.py";
const python1_data = "img.png";
const python2_code = "click.py";
const python2_data = "click.txt";

const main = async () => {
  const limitTime = executionTime.add(challengeTime, "s");
  let currentTime = executionTime;
  console.log("--- スタート ---");

  do {
    console.log(`リミット：${limitTime.format("HH:mm:ss")}`);
    console.log(`現在：${currentTime.format("HH:mm:ss")}`);

    await pythonShell("スクリーンショット取得", python1_code);

    await calculation(); // 画像より数式を取得し計算

    await pythonShell("計算結果入力", python2_code);

    // 時間更新
    currentTime = dayjs();
    console.log(); // ただのログ改行
  } while (limitTime.unix() > currentTime.unix());

  console.log("--- 終了 ---");
};

// python処理実行
const pythonShell = async (title, file) => {
  console.log(`--- ${title} ---`);
  await PythonShell.run(file, null)
    .then((response) => {
      createLog("完了");
    })
    .catch((error) => {
      console.log(error);
    });
};

const calculation = async () => {
  console.log("--- 画像より計算式読み込み、算出 ---");

  const text = await Tesseract.recognize(python1_data, "eng", {}).then(
    ({ data: { text } }) => {
      return text;
    }
  );
  createLog("文字列読み込み");

  const textSplit = text.split("\n").filter((e) => e);
  const value = [];
  for (let item of textSplit) {
    const query = item.substr(0, item.indexOf("=")); // '='移行を削除（計算時邪魔になるため）
    const result = Function("return (" + query + ");")();
    value.push(result);
    console.log(`${query} = ${result}`);
  }
  createLog("算出");

  // click.py との連携用ファイル作成
  fs.writeFile(python2_data, value.join("\n"), function (err) {
    if (err) {
      throw err;
    }
  });
};

const createLog = (text) => {
  console.log(`${text}：${dayjs().format("HH:mm:ss")}`);
};

main();

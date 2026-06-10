const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 데이터 저장 파일 경로
const DATA_FILE = path.join(__dirname, 'tennis_data.json');

app.use(express.json());
app.use(cors()); // 외부 접근 허용
app.use(express.static(path.join(__dirname, 'public'))); // 프론트엔드 정적 파일 서빙

// 데이터 초기화 및 로드 함수
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = { date: "", state: { attendees: [], leftMembers: [], seqCounter: 0 }, courtConfirmed: { 1: false, 2: false, 3: false, 4: false } };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { date: "", state: { attendees: [], leftMembers: [], seqCounter: 0 }, courtConfirmed: { 1: false, 2: false, 3: false, 4: false } };
  }
}

// 데이터 저장 함수
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// 1. 데이터 가져오기 API
app.get('/', (req, res) => {
  const data = readData();
  res.json(data);
});

// 2. 데이터 저장하기 API
app.post('/', (req, res) => {
  const { date, state, courtConfirmed } = req.body;
  const data = { date, state, courtConfirmed };
  writeData(data);
  res.json({ success: true, message: '데이터가 성공적으로 저장되었습니다.' });
});

// 메인 페이지 서빙 (public/index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`테니스 동호회 서버가 포트 ${PORT}에서 작동 중입니다.`);
});
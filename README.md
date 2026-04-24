# AI Playtest Intelligence Copilot

## 제품 개요
**AI Playtest Intelligence Copilot**은 게임 개발팀(특히 Unreal Engine 환경)을 위한 AI 기반 플레이테스트 데이터 분석 대시보드 프로토타입입니다. 이 도구는 플레이테스트 및 개발 빌드에서 생성되는 성능 지표, 크래시 리포트, 진행 상황(Telemetry) 및 QA 자유 서술 피드백을 통합하여 분석합니다. 단순한 데이터 나열이 아니라, 유사 이슈를 클러스터링하고 우선순위를 계산하여 "가장 먼저 해결해야 할 위험 요소"를 식별해주는 것이 핵심 목표입니다.

주요 사용자는 Technical Artist, QA Lead, Game Designer, Production PM 등이며, 이들이 방대한 로그 속에서 핵심을 빠르게 파악할 수 있도록 돕습니다.

## 실행 방법
본 프로젝트는 Next.js 기반으로 구축되었습니다.

1. 의존성 설치:
   npm install


2. 개발 서버 실행:
   npm run dev


3. 브라우저에서 `http://localhost:3000`으로 접속하여 대시보드 확인.

## 데이터 구조
앱 내 데이터는 4가지 주요 형태로 정의되어 있습니다 (`src/lib/types.ts` 참고):
- **PlayEvent**: 유저의 세션 진행, 레벨 로드, 체크포인트, 튜토리얼 진행 상태 등.
- **PerformanceMetric**: 특정 시점의 평균 FPS, 프레임 타임(ms), 히치(Hitch) 발생 횟수, 메모리 및 GPU 타임.
- **CrashReport**: 크래시 덤프, 콜스택 요약, 로그 발췌본 등.
- **QAFeedback**: QA/테스터의 주관적 코멘트, 심각도, 재현 방법.

이 데이터들은 통합되어 **Issue** 객체로 가공되며, 이 객체가 UI에 노출됩니다.

## 분석 로직 설명
분석 로직은 `src/lib/analysis.ts`에 위치하며 크게 4단계로 구성됩니다:
1. **Issue Detection**: 비정상적인 성능 저하(FPS < 30 등)나 튜토리얼 조기 이탈(SessionEnd=Quit) 등의 이상 징후를 규칙 기반으로 감지.
2. **Clustering**: 감지된 이상 징후와 크래시, QA 피드백을 발생 레벨(Level) 및 유사 주제(예: 프레임드랍, OOM)에 따라 그룹화.
3. **Priority Scoring**: 빈도(Frequency), 심각도(Severity), 진행 방해 여부(Blocker-ness), 성능 임팩트, 피드백 밀도를 가중치 계산하여 0~100점의 우선순위 점수 산출.
4. **Summarization**: 클러스터링된 데이터를 바탕으로 원인 가설, 권장 담당자, 다음 액션 아이템 등을 도출.

## 향후 실제 AI API 연동 포인트
이 프로토타입은 mock 데이터를 사용하고 있으나, 실제 프로덕션 환경에서는 다음 지점에 LLM API 및 머신러닝 파이프라인이 연동됩니다:

- **텍스트/로그 클러스터링 (`src/lib/analysis.ts - clusterIssues`)**:
  현재는 단순 규칙(Rule-based)이지만, 실제로는 `OpenAI text-embedding-ada-002` (또는 로컬 임베딩 모델) 등을 사용해 수천 건의 콜스택과 QA 텍스트를 벡터 DB에 넣고, 코사인 유사도로 밀집된 이슈 클러스터를 찾아내야 합니다.
- **가설 및 요약 생성 (`src/lib/analysis.ts - generateSummary`)**:
  현재는 정적 텍스트로 대체되어 있으나, 이 부분에 `GPT-4` 등의 LLM API 호출 코드를 삽입하여, 묶인 로그/피드백의 공통 분모를 요약하고 `Why It Matters`, `Hypotheses`를 동적으로 생성하게 됩니다. (프롬프트 예시: "다음 로그와 QA 코멘트를 읽고 언리얼 엔진 기준의 크래시/성능 저하 원인 가설을 3가지 작성하라.")

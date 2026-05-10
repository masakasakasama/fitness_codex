# ジムトレーニング記録アプリ 仕様書（v0.1）

## 1. 目的
個人利用（1ユーザー）向けに、土日中心の運用でも継続しやすいトレーニング記録・履歴分析・提案機能を提供する。主要利用環境はスマホ、補助利用はPC。

## 2. スコープ
- トレーニング記録（機材、重量、回数、セット数、きつさ）
- 履歴閲覧と機材単位の推移表示
- 体重・体組成ログ
- ルールベースのコーチ提案
- localStorage永続化 + GitHub data.json同期
- PWA / オフライン読み込み

## 3. 非スコープ
- ログイン・マルチユーザー
- チョコザップ等外部サービスとの自動連携
- 種目横断の総ボリューム指標

## 4. データモデル（要点）
### 4.1 TrainingEntry
- id
- dateJst (YYYY-MM-DD)
- equipmentId
- weightKg
- repsPerSet (default: 10)
- setCount (default: 3)
- effort: `easy | normal | max`（任意）
- note (optional)
- updatedAt (ISO8601)

### 4.2 Equipment
- id
- name
- category (`machine | dumbbell | cable | cardio`)
- active
- updatedAt

初期10件（東上野店想定）
- チェストプレス
- ショルダープレス
- マルチプレス
- ラットプルダウン
- レッグプレス
- アダクション/アブダクション
- ダンベル
- ケーブルマシン
- トレッドミル
- バイク

### 4.3 BodyLog
- id
- measuredDateJst
- weightKg
- bodyFatPct (optional)
- muscleMassKg (optional)
- bmi (derived)
- updatedAt

### 4.4 Profile
- heightCm
- currentWeightKg
- targetWeightKg
- trainingConstraint: `weekend_only`
- updatedAt

### 4.5 SyncState
- githubRepo
- githubPath (`data.json`)
- token (local only)
- lastSyncAt

## 5. 入力仕様
- 当日（Asia/Tokyo）を初期選択
- 重量選択肢
  - 4–14kg: 2kg刻み
  - 15kg以上: 5kg刻み
- 同重量×同回数×Nセットの一括記録（セット個別編集なし）
- 入力3タップ以内を目標にUIを設計

## 6. 記録画面の機材選択
- デフォルト表示: 「過去に使ったことのある機材」
- サブアクション: 「他の機材から選ぶ」で全機材ピッカー

## 7. コーチ提案ロジック（優先順）
1. **短期文脈（24-72h）**
   - 昨日が`max`中心なら休息または別部位軽め
   - 5日連続トレなら休息推奨
2. **制約適応**
   - 平日未実施は不足扱いしない
   - 土曜高強度なら日曜は補完部位軽め
3. **中期傾向（過去7日/30日）**
   - 7日間で未刺激部位を抽出して提示
   - 30日傾向で機材別伸びを評価
4. **次回目安（機材別）**
   - 直近2回で`easy`続き & 8-12回達成 → 重量+2〜5kg
   - `max`続き & 8回未満 → 重量-2〜5kg or 回数目標8に調整
   - `normal`で10回×3維持 → 同重量で11-12回目標

## 8. 栄養提案
Mifflin-St Jeorで推定し、増量時は
- メンテナンス +250〜350kcal/day
- タンパク質 1.6〜2.2g/kg/day

## 9. 同期仕様
- localStorageを常時正とする（オフライン優先）
- GitHub同期は任意設定
- 公開repoならトークンなし読み取り可
- 競合は `updatedAt` の新しい方を採用（LWW）

## 10. UX/設計制約
- コールアウト装飾禁止
- カード入れ子禁止
- 背景色強調禁止（タイポ/余白で表現）
- 根拠なき励まし表現禁止（数字根拠必須）

## 11. 受け入れ条件（抜粋）
- 記録の編集が新規追加ではなく上書きになる
- 過去日付の編集削除ができる
- スマホ/PCで同一GitHubデータが閲覧できる
- 通信失敗時でも記録/閲覧が継続可能

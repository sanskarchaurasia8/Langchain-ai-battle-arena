import SolutionCard from './SolutionCard';
import JudgeCard from './JudgeCard';

const TAGS_1 = ['ES6+', 'Functional', 'Dual-Approach'];
const TAGS_2 = ['Procedural', 'High-Perf', 'Error Handling'];

export default function BattlePanel({ result }) {
  return (
    <div className="battle-columns">
      <SolutionCard
        solution={result.solution_1}
        cardIndex={1}
        score={result.judge.solution_1_score}
        tags={TAGS_1}
      />
      <JudgeCard judge={result.judge} problem={result.problem} />
      <SolutionCard
        solution={result.solution_2}
        cardIndex={2}
        score={result.judge.solution_2_score}
        tags={TAGS_2}
      />
    </div>
  );
}

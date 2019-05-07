interface SearchProblemState<CostType = number, heuristicType = any> {
  parent: SearchProblemState | EmptyState;
  heuristic?: heuristicType;
  cost?: CostType;
}

// interface SearchProblemChildState extends SearchProblemState {
//   parent: EmptyState;
// }

type EmptyState = null;
type MaybeState<State extends SearchProblemState> = State | EmptyState;
const isEmptyState = <State extends SearchProblemState>(
  mS: MaybeState<State>
): mS is State => mS === null;

// const isSearchProblemInitialState = <State extends SearchProblemState>(
//   state: SearchProblemState<State>
// ): state is SearchProblemInitialState => state.parent === null;

type TransitionFunction<State extends SearchProblemState> = (
  state: State
) => MaybeState<State>;
type TransitionModel<State extends SearchProblemState> = Set<
  TransitionFunction<State>
>;
type GoalTest<State extends SearchProblemState> = (state: State) => boolean;

// @TODO: Cam do this with extra interface that has the initial state, but is that really what I want?

interface SearchProblem<State extends SearchProblemState> {
  initialState: State;
  actions: TransitionModel<State>;
}
type Solution<State extends SearchProblemState> = State[];

interface Frontier<State extends SearchProblemState> {
  add: (state: State) => Frontier<State>;
  isEmpty: () => Boolean;
  getNext: () => State;
  has: (state: State) => Boolean;
}
interface FrontierConstructor {
  new <State extends SearchProblemState>(
    initialSearchProblemState: State
  ): Frontier<State>;
  readonly prototype: Frontier<SearchProblemState>;
}
declare var Frontier: FrontierConstructor;

const getSolution = <State extends SearchProblemState>(
  s: State
): Solution<State> => {
  // @TODO: Implement this
  return [s];
};

const explore = <State extends SearchProblemState>(
  state: State,
  actions: TransitionModel<State>
): Set<State> => {
  const newSearchProblemStates = new Set<State>();
  for (const action of actions) {
    const nextSearchProblemState = action(state);
    if (!isEmptyState(nextSearchProblemState)) {
      newSearchProblemStates.add(nextSearchProblemState);
    }
  }
  return newSearchProblemStates;
};

const TreeSearch = <State extends SearchProblemState>(
  { initialState, actions }: SearchProblem<State>,
  goalTest: GoalTest<State>
): Solution<State> | Error => {
  const frontier = new Frontier(initialState);
  while (true) {
    if (frontier.isEmpty()) {
      return new Error();
    }
    const leafNode = frontier.getNext();
    if (goalTest(leafNode)) {
      return getSolution(leafNode);
    }
    const discoveredNodes = explore(leafNode, actions);
    for (const node of discoveredNodes) {
      frontier.add(node);
    }
  }
};

const graphSearch = <State extends SearchProblemState>(
  { initialState, actions }: SearchProblem<State>,
  goalTest: GoalTest<State>
) => {
  const exploredSet = new Set<State>();
  const frontier = new Frontier(initialState);
  while (true) {
    if (frontier.isEmpty()) {
      return new Error();
    }
    const leafNode = frontier.getNext();
    if (goalTest(leafNode)) {
      return getSolution(leafNode);
    }
    exploredSet.add(leafNode);
    const discoveredNodes = explore(leafNode, actions);
    for (const node of discoveredNodes) {
      if (!frontier.has(node) && !exploredSet.has(node)) {
        frontier.add(node);
      }
    }
  }
};

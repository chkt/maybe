type transform<T, R> = (v:T) => R;
type process<T, R0, R1> = (fn:transform<T, R0>, v:T) => R1;


export function apply<T, R0, R1>(b:process<T, R0, R1>, a:transform<T, R0>) : transform<T, R1> {
	return b.bind(null, a);
}

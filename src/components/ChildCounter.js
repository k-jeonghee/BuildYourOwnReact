import Didact from '../didact';
import { useMemo } from '../hooks/useMemo';
import { useState } from '../hooks/useState';
import { useEffect } from '../hooks/useEffect';

function ChildCounter(count, memoizedCallback) {
	console.log('Child');
	const [num, setNum] = useState(5);
	const memoizedValue = useMemo(() => {
		console.log('useMemo compute 실행');
		return num * 5;
	}, []);
	useEffect(() => memoizedCallback(), [memoizedCallback]);
	return Didact.createElement('p', null, `Child: ${count} / MemoizedValue: ${memoizedValue}`);
}

export default Didact.memo(ChildCounter);

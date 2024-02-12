export function shallowEqual(objA, objB) {
	// 두 객체의 레퍼런스가 같으면 true 반환
	if (objA === objB) {
		return true;
	}

	// 두 객체가 null이거나 다른 데이터 타입이면 false 반환
	if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
		return false;
	}

	// 두 객체의 속성 개수를 비교
	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);
	if (keysA.length !== keysB.length) {
		return false;
	}

	// 각 속성의 값이 동일한지 확인
	for (let key of keysA) {
		if (!objB.hasOwnProperty(key) || objA[key] !== objB[key]) {
			return false;
		}
	}

	return true;
}

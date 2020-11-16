import useSWR from 'swr'
import axios from 'axios';

export function useFetch(url) {
  	const { data, error } = useSWR(url, async url => {
		const response = await axios.get(url);
		return response.data;
	});

	return { data, error }
}

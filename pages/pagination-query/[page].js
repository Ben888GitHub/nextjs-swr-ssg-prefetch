import Head from 'next/head';
import useSWR, { SWRConfig } from 'swr';
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';

import { useRouter } from 'next/router';

const fetcher = async (url, page, limit) => {
	const { data } = await axios.get(`${url}?_page=${page}&_limit=${limit}`);
	console.log(data);
	return data;
};

const API = 'https://jsonplaceholder.typicode.com/posts';

export async function getStaticProps({ params }) {
	// console.log(params.page);
	// const page = params.page;
	const limit = 5;
	const posts = await fetcher(API, params.page, limit);
	return {
		props: {
			page: params.page,
			fallback: {
				[API]: posts
			}
		}
	};
}

export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: 'blocking'
	};
};

function Pages(props) {
	const router = useRouter();
	const [page, setPage] = useState(() => Number(props?.props?.page) || 1);
	console.log(props?.props?.page);
	const { data: posts, error } = useSWR(
		[API, page, 5],
		() => fetcher(API, page, 5),
		{
			// refreshInterval: 1000,
			keepPreviousData: true
		}
	);

	return (
		<>
			<button
				disabled={page === 1}
				onClick={() => {
					setPage(page - 1);
					router.push({
						pathname: '/pagination-query/[page]',
						query: { page: page - 1 }
					});
				}}
			>
				Previous
			</button>
			<button
				style={{ marginLeft: 10 }}
				onClick={() => {
					setPage(page + 1);
					router.push({
						pathname: '/pagination-query/[page]',
						query: { page: page + 1 }
					});
				}}
			>
				Next
			</button>
			{posts?.map((post) => (
				<div key={post?.id}>
					<Link href={`/post/${post?.id}`}>
						<h2>{post?.title}</h2>
					</Link>
					<p>{post?.body}</p>
				</div>
			))}
		</>
	);
}

function PaginationQuery(props) {
	const { fallback } = props;
	return (
		<SWRConfig value={{ fallback }}>
			<Pages props={props} />
		</SWRConfig>
	);
}

export default PaginationQuery;

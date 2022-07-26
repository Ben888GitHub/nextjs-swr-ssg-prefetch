import Head from 'next/head';
import styles from '../styles/Home.module.css';
import useSWR, { SWRConfig } from 'swr';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());
const API = 'https://jsonplaceholder.typicode.com/posts';

export async function getStaticProps() {
	const posts = await fetcher(API);
	return {
		props: {
			fallback: {
				'https://jsonplaceholder.typicode.com/posts': posts
			}
		}
	};
}

function Posts() {
	const { data: posts, error } = useSWR(API, fetcher);

	// data && console.log(data);

	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<h1>
					Welcome to <a href="https://nextjs.org">Next.js!</a>
				</h1>
				{posts?.map((post) => (
					<div key={post?.id}>
						<Link href={`/post/${post?.id}`}>
							<h2>{post?.title}</h2>
						</Link>
						<p>{post?.body}</p>
					</div>
				))}
			</main>
		</div>
	);
}

export default function Home({ fallback }) {
	// if (error) return 'An error has occurred.';
	// if (!data) return 'Loading...';

	return (
		<SWRConfig value={{ fallback }}>
			<Posts />
		</SWRConfig>
	);
}

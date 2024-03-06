import { MultiSelectBox } from "./components/MultiSelectBox";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Home() {
	return (
		<main className='flex min-h-screen flex-col items-center justify-center p-24'>
			<MultiSelectBox />
		</main>
	);
}

import { Link } from "react-router-dom"
import Header from "./Header"
import { IoIosArrowBack } from "react-icons/io";


const Settingpage = () => {
	return (
		<div>
			<Header />
			<div>
				<div className="flex items-center p-7 gap-2">
					<Link to="/" className="">
						<IoIosArrowBack size={20}/>
					</Link>
					<h1 className="text-xl capitalize font-bold">Settings</h1>
				</div>
			</div>
		</div>
	)
}

export default Settingpage
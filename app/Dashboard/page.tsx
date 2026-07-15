import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Dashboard() {
    return(
        <div className = "flex h-full flex-1 flex-col gap-20 p-10">
            <div>
                <h2>Your AUs</h2>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 p-10">
                    <Link href="/AUs/New">
                        <div className="flex aspect-4/5 items-center justify-center rounded-xl border-2 border-dashed">
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="size-8 text-gray-400"
                            />
                        </div>
                    </Link>
                </div>

            </div>
        </div>
    );
}
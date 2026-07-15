import Button from "@/components/Button";

export default function New() {
    return(
        <div className = "flex h-full flex-1 flex-col items-center justify-center p-10 gap-20">
            <section>
                <h1>Create A New AU</h1>
            </section>

            <div>
                <h1>Title</h1>
                <input
                    type="text"
                    placeholder="Title"
                />
            </div>

            <div>
                <h1>Description</h1>
                <input
                    type="text"
                    placeholder="Description"
                />
            </div>

            <Button text="Create AU" />

        </div>
    );
}
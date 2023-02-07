import React, {useState} from "react";
import PropTypes from "prop-types";

const AddPost = ({ uploadImage, captureFile }) => {

    const [text, setText] = useState("");

    return (
        <div>
            <h1>uploadImage</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    uploadImage(text);
                }}
            >
                <input
                    type="file"
                    accept={".jpg, .jpeg, .png, .bmp, .gif"}
                    onChange={captureFile}
                    required
                />

                <input
                    type="text"
                    placeholder="Enter a description"
                    onChange={(e) => setText(e.target.value)}
                    required
                />

                <button>Upload</button>
            </form>
        </div>
    )
};

AddPost.propTypes = {
    uploadImage: PropTypes.func.isRequired,
    captureFile: PropTypes.func.isRequired,
};

export default React.memo(AddPost);
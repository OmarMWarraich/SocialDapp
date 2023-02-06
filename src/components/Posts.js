import React from "react";
import PropTypes from "prop-types";

const Posts = ({ posts, likePost }) => {
    return (
        <div>
            {posts.length > 0 && posts.map((image, index) => (
                <div key={index}>
                    <br />
                    <img 
                      src={`https://ipfs.infura.io/ipfs/${image.hash}`} 
                      style={{ maxWidth: '420px' }} 
                      alt={image.description}
                    />

                    <p>{image.description}</p>
                    <p>@{image.uploader}</p>

                    <div>
                        <p>Likes: {image.likes.toString() }</p>

                        <button
                            onClick={() => {
                                const amountOfLikesToAdd = 1;

                                likePost(image.id, amountOfLikesToAdd);
                            }}
                        >
                            Like
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

Posts.propTypes = {
    posts: PropTypes.array.isRequired,
    likePost: PropTypes.func.isRequired
};

export default Posts;
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract PhotoSharing {

    uint public imageCount = 0;

    mapping (uint => Image) public images;

    struct Image {
        uint id;
        string hash;
        string description;
        address payable uploader;
        uint likes;
    }

    event ImageCreated(
        uint id,
        string hash,
        string description,
        address payable uploader
    );

    function uploadImage(string memory _imgHash, string memory _description) public {

        require(bytes(_imgHash).length > 0);

        require(bytes(_description).length > 0);

        require(msg.sender != address(0));

        imageCount++;

        images[imageCount] = Image(imageCount, _imgHash, _description, payable(msg.sender), 0);

        emit ImageCreated(imageCount, _imgHash, _description, payable(msg.sender));
        
    }

    function likeAPost(uint _id_of_post_to_like) public payable{
        require(_id_of_post_to_like > 0 && _id_of_post_to_like <= imageCount);

        Image memory _image_to_like = images[_id_of_post_to_like];

        address payable _uploader = _image_to_like.uploader;

        _uploader.transfer(msg.value);

        _image_to_like.likes = _image_to_like.likes + msg.value;

        images[_id_of_post_to_like] = _image_to_like;
    }
}
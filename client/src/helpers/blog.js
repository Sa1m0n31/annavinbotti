import axios from "axios";
import { convertToRaw } from 'draft-js';

const generateImageLink = (img) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let formData = new FormData();
    formData.append('image', img);

    return axios.post(`/image/add`, formData, config);
}


const getAllBlogPosts = () => {
    return axios.get('/blog-api/all');
}

const getBlogPost = (id) => {
    return axios.get('/blog-api', {
        params: {
            id
        }
    });
}

const addBlogPost = (titlePl, titleEn, excerptPl, excerptEn, contentPl, contentEn, image) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let formData = new FormData();
    formData.append('image', image);
    formData.append('titlePl', titlePl);
    formData.append('titleEn', titleEn);
    formData.append('excerptPl', excerptPl);
    formData.append('excerptEn', excerptEn);
    formData.append('contentPl', JSON.stringify(convertToRaw(contentPl?.getCurrentContent())));
    formData.append('contentEn', JSON.stringify(convertToRaw(contentEn?.getCurrentContent())));

    return axios.post(`/blog-api/add`, formData, config);
}

const updateBlogPost = (id, titlePl, titleEn, excerptPl, excerptEn, contentPl, contentEn, image) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let formData = new FormData();
    formData.append('id', id);
    formData.append('image', image);
    formData.append('titlePl', titlePl);
    formData.append('titleEn', titleEn);
    formData.append('excerptPl', excerptPl);
    formData.append('excerptEn', excerptEn);
    formData.append('contentPl', JSON.stringify(convertToRaw(contentPl?.getCurrentContent())));
    formData.append('contentEn', JSON.stringify(convertToRaw(contentEn?.getCurrentContent())));

    return axios.put(`/blog-api/update`, formData, config);
}

const deleteBlogPost = (id) => {
    return axios.delete('/blog-api/delete', {
        params: {
            id
        }
    });
}

const getPostBySlug = (slug) => {
    return axios.get('/blog-api/get-post-by-slug', {
        params: {
            slug
        }
    });
}

export { getAllBlogPosts, getBlogPost, addBlogPost, updateBlogPost, deleteBlogPost, generateImageLink, getPostBySlug }

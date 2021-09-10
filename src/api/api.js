import http from './http'
export const success_code = 2000;
export const failed_code = 4000;

//解析token
export const checkToken = () => {
    return http.requestGet('/user/check-token');
}

//登录
export const doLogin = (verifyCode, from, hewieUser) => {
    return http.requestPost('/user/login/' + verifyCode + '?from=' + from, hewieUser);
}

//获取分类列表
export const listCategory = () => {
    return http.requestGet('/admin/category/list');
}
//删除分类
export const deleteCategory = (categoryId) => {
    return http.requestDelete('/admin/category/' + categoryId);
}

//添加分类
export const postCategory = (category) => {
    return http.requestPost('/admin/category/', category);
}

//更新分类
export const updateCategory = (category, categoryId) => {
    return http.requestPut('/admin/category/' + categoryId, category);
}

//获取轮播图列表
export const listLoops = () => {
    return http.requestGet('/admin/loop/list');
}

//添加轮播图
export const postLoop = (loop) => {
    return http.requestPost('/admin/loop/', loop);
}
//更新轮播图
export const updateLoop = (loop, loopId) => {
    return http.requestPut('/admin/loop/' + loopId, loop);
}
//删除轮播图
export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/loop/' + loopId);
}

//获取用户列表
export const listUsers = (page, size) => {
    return http.requestGet('/user/list?page=' + page + '&size=' + size);
};

//获取用户列表
export const doUserSearch = (userName, email) => {
    return http.requestGet('/user/list?page=1&size=10&userName=' + userName + '&email=' + email);
};

//删除用户
export const deleteUserById = (userId) => {
    return http.requestDelete('/user/' + userId);
};

//重置密码
export const resetPassword = (userId, newPassword) => {
    return http.requestPut('/user/reset-password/' + userId + '?password=' + newPassword);
};

//获取邮箱验证码
export const getVerifyCode = (newEmail, type) => {
    return http.requestGet('/user/verify_code/?email=' + newEmail + '&type=' + type);
}

//更新邮箱
export const updateEmailAddr = (newEmail, verifyCode) => {
    return http.requestPut('/user/email?email=' + newEmail + '&verify_code=' + verifyCode);
}
//更新用户信息
export const updateUserInfo = (userInfo, userId) => {
    return http.requestPut('/user/user_info/' + userId, userInfo);
}

export const checkUserName = (userName) => {
    return http.requestGet('/user/user_name?user_name=' + userName)
}

export const getWebSiteSeoInfo = () => {
    return http.requestGet('/admin/web_site_info/seo')
}

export const getWebSiteTitle = () => {
    return http.requestGet('/admin/web_site_info/title')
}

export const updateWebsiteTitle = (title) => {
    return http.requestPut('/admin/web_site_info/title?title=' + title);
}

export const updateWebsiteSeo = (description, keywords) => {
    return http.requestPut('/admin/web_site_info/seo?description=' + description + '&keywords=' + keywords);
}


export const listFriendLinks = () => {
    return http.requestGet('/admin/friend_link/list')
}

export const postFriendLink = (friendLink) => {
    return http.requestPost('/admin/friend_link', friendLink);
}

export const updateFriendLink = (friendLink, linkId) => {
    return http.requestPut('/admin/friend_link/' + linkId, friendLink);
}
export const deleteFriendLink = (linkId) => {
    return http.requestDelete('/admin/friend_link/' + linkId);
}

export const getCategories = () => {
    return http.requestGet('/admin/category/list');
}


export const listImages = (page, size, original) => {
    return http.requestGet('/admin/image/list/' + page + '/' + size + '?original=' + original);
}
export const postArticle = (article) => {
    return http.requestPost('/admin/article', article);
}
export const saveArticleDraft = (article) => {
    return http.requestPost('/admin/article', article);
}

export const listArticles = (page, size, state, keyword, categoryId) => {
    return http.requestGet('/admin/article/list/' + page + '/' + size + '?categoryId=' + categoryId + '&keyword=' + keyword + '&state=' + state);
}

export const deleteArticleAbs = (articleId) => {
    return http.requestDelete('/admin/article/' + articleId);
}

export const deleteArticlePretend = (articleId) => {
    return http.requestDelete('/admin/article/state/' + articleId);
}

export const topArticle = (articleId) => {
    return http.requestPut('/admin/article/top/' + articleId);
}

export const getArticleDetail = (articleId) => {
    return http.requestGet('/admin/article/' + articleId);
}
export const updateArticle = (article, articleId) => {
    return http.requestPut('/admin/article/' + articleId, article);
}

export const listComments = (page, size) => {
    return http.requestGet('/admin/comment/list/' + page + '/' + size);
}

export const deleteCommentById = (commentId) => {
    return http.requestDelete('/admin/comment/' + commentId);
}
export const topComment = (commentId) => {
    return http.requestPut('/admin/comment/top/' + commentId);
}

export const deleteImage = (imageId) => {
    return http.requestDelete('/admin/image/' + imageId);
}

export const getArticleCount = () => {
    return http.requestGet('/admin/article/count');
}

export const getUserCount = () => {
    return http.requestGet('/user/register_count');
}

export const getViewCount = () => {
    return http.requestGet('/admin/web_site_info/view_count');
}

export const getCommentCount = () => {
    return http.requestGet('/admin/comment/count');
}

export const doLogout = () => {
    return http.requestGet('/user/logout');
}
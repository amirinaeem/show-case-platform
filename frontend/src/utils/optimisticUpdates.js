
export const createOptimisticComment = (user, text) => ({
  _id: `temp-${Date.now()}`,
  text,
  user: {
    _id: user._id,
    name: user.name,
    avatar: user.avatar
  },
  likes: [],
  replies: [],
  createdAt: new Date().toISOString(),
  isOptimistic: true
});

export const createOptimisticReply = (user, text) => ({
  _id: `temp-reply-${Date.now()}`,
  text,
  user: {
    _id: user._id,
    name: user.name,
    avatar: user.avatar
  },
  likes: [],
  createdAt: new Date().toISOString(),
  isOptimistic: true
});
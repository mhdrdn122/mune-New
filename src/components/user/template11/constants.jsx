import { useMemo } from "react";

export const cards = [
  {
    id: 1,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU",
    items: [
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 4000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s", duration: 6000 },
    ],
  },
  {
    id: 2,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 3000 },
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 5000 },
    ],
  },
  {
    id: 3,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 4000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s", duration: 6000 },
    ],
  },
  {
    id: 4,
    title: "",
    avatar: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 5000 },
    ],
  },
  {
    id: 5,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s",
    items: [
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 4000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 6000 },
    ],
  },
  {
    id: 6,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s" },
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s", duration: 5000 },
    ],
  },
  {
    id: 7,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 4000 },
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 6000 },
    ],
  },
  {
    id: 8,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 5000 },
    ],
  },
  {
    id: 9,
    title: "",
    avatar: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s", duration: 4000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s", duration: 6000 },
    ],
  },
  {
    id: 10,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU" },
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s", duration: 5000 },
    ],
  },
  {
    id: 11,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 4000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 6000 },
    ],
  },
  {
    id: 12,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU",
    items: [
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s", duration: 5000 },
    ],
  },
  {
    id: 13,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 4000 },
      { url: "https://www.mshwar.sy/storage/places/F8NYwIR1Ii1ZZjpHnbkyvIhEDQCWBOHqbb3k8jh8.jpg", duration: 6000 },
    ],
  },
  {
    id: 14,
    title: "",
    avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkR7CBIcIUI42wVXVpx1tBm7VkMzttQAIrrw&s",
    items: [
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYFtXUnd9oof5B81NH_OCNp0pR7NACNoBIw&s" },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG5BCSc0qyYV90Qtj0rVEBVQfz_Jo_BPdkRfmKbZw7dpIIYPGuz0zQ7SBT_spNbmGJKr0&usqp=CAU", duration: 3000 },
      { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgKuTRR3QZ8OdGjwyoXu0yVyKiEjOVo5E--66RlsSNh0bLkebm9CHlukXvRxrh2XvZwSU&usqp=CAU", duration: 5000 },
    ],
  },
];




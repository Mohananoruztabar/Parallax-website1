import {lerp} from './app.js'
import { createProjects , createBlogposts } from './master.js'

const video = document.querySelector("video")
const videoSection = document.querySelector("#video")
const main = document.querySelector("main")

createProjects();
createBlogposts();

main.addEventListener('scroll' , ()=>{
    animateVideo()
})
const headerLeft = document.querySelector(".text-header-left")
const headerRight = document.querySelector(".text-header-right")

function animateVideo(){
    let {bottom} = videoSection.getBoundingClientRect()
    let scale = 1 - ((bottom - window.innerHeight) * .0005)
    scale = scale < .2 ? .2 : scale > 1 ? 1 : scale
    video.style.transform = `scale(${scale})`

    let textTrans = bottom - window.innerHeight
    textTrans = textTrans < 0 ? 0 : textTrans
    headerLeft.style.transform = `translateX(${-textTrans}px)`
    headerRight.style.transform = `translateX(${textTrans}px)`
}

const projectSticky = document.querySelector(".projects-sticky")
const projectSlider = document.querySelector(".projects-slider")
let projectTargetX = 0
let projectCurrentX = 0
let percentages = {
    small : 700 ,
    medium : 300 ,
    large : 100
}
let limit = window.innerWidth <= 600 ? percentages.small :
    window.innerWidth <= 1100 ? percentages.medium :
    percentages.large

function setLimit(){
    limit = window.innerWidth <= 600 ? percentages.small : window.innerWidth <= 1100 ? percentages.medium : percentages.large
}

window.addEventListener('resize' , setLimit)

function animateProjects(){
    let offsetTop = projectSticky.parentElement.offsetTop
    let percentages = ((main.scrollTop - offsetTop) / window.innerHeight ) * 100
    percentages = percentages < 0 ? 0 : percentages > limit ? limit : percentages;
    projectTargetX = percentages
    projectCurrentX = lerp(projectCurrentX , projectTargetX , .1)
    projectSlider.style.transform = `translate3d(${-(projectCurrentX)}vw, 0 ,0)`
}
const blogSection = document.getElementById("blog")
const blogPosts = [...document.querySelectorAll(".post")]
function scrollBlogPosts(){
    let blogSectionTop = blogSection.getBoundingClientRect().top
    for(let i = 0 ; i< blogPosts.length ; i++)
        if(blogPosts[i].parentElement.getBoundingClientRect().top <= 1){
            let offset = (blogSectionTop + (window.innerHeight * (i + 1))) * .0005
            offset = offset < -1 ? -1 : offset >= 0 ? 0 : offset ;
            blogPosts[i].style.transform = `scale(${1 + offset})`
        }
}

const circleSction = document.getElementById('circle-section')
const circle = document.querySelector(".circle")
function scrollCricle(){
    let {top} = circleSction.getBoundingClientRect()
    let scaleTop = Math.abs(top)
    let scale = (scaleTop / window.innerHeight)
    scale = scale < 0 ? 0 : scale > 1 ? 1 : scale
    if(top <= 0){
        circle.style.transform = `translate(-50% , -50%) scale(${scale})`
    }else{
        circle.style.transform = `translate(-50% , -50%) scale(${0})`
    }
}

const textLeft = document.querySelector(".text-left")
const textRight = document.querySelector(".text-right")
const dContainer = document.querySelector(".discover-container")
function scrollDiscover(){
    let {bottom} = dContainer.getBoundingClientRect()
    let textTrans = bottom - window.innerHeight
    textTrans = textTrans < 0 ?  0 : textTrans
    textLeft.style.transform = `translateX(${-textTrans}px)`
    textRight.style.transform = `translateX(${textTrans}px)`
}


const textRevaels = [...document.querySelectorAll(".text-reveal")]
let callback = (entris => {
    entris.forEach(entry => {
        if(entry.isIntersecting){
            [...entry.target.querySelectorAll("span")].forEach((span , idx) => {
                setTimeout(()=> {
                    span.style.transform = `translateY(0)`
                }, (idx+1)* 50)
            })
        }
    })
})

let options = {
    rootMargin : '0px' ,
    threshold : 1.0
}
let observer = new IntersectionObserver(callback , options)

textRevaels.forEach(text => {
    let string = text.innerText
    let html = ""
    for(let i = 0 ; i < string.length ; i++){
        html += `<span>${string[i]}</span>`
    }
    text.innerHTML = html
    observer.observe(text)
})




function animate(){
    animateProjects()
    requestAnimationFrame(animate)
}
main.addEventListener('scroll' ,()=>{
    scrollBlogPosts()
    scrollCricle()
    scrollDiscover()
} )
animate()


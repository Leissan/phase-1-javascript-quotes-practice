//global variables make life easy
//form is important since thats how we get user input
//ul is useful since thats where ill be adding elements

/*Populate page with quotes with a GET request to http://localhost:3000/quotes?_embed=likes.
The query string in this URL tells json-server to include the likes for a quote in the JSON of
the response. You should not use this query string when creating or deleting a quote.*/
 let quotesList=document.querySelector('#quote-list')
 let newQuoteForm= document.getElementById('new-quote-form')

 ////IMPORTANT STRUCTURE FOR MOST APPLICATIONS
 //create the outermost element > fill it > append > grab element > add event listeners
fetch('http://localhost:3000/quotes?_embed=likes')
.then (res=>res.json())
.then ((quotesArray) => {
       quotesArray.forEach((quoteObj) => {
       turnQuotesIntoHTML(quoteObj)
       })
})

newQuoteForm.addEventListener('submit', (event) => {
    // form default action is to refresh the page, we dont want that
    event.preventDefault()
    let author = event.target.author.value
    let quoteContent = event.target['new-quote'].value //if there is a dash (-) use bracket notation

    fetch('http://localhost:3000/quotes', {
        method: 'POST',
        
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            author: author,
            quote: quoteContent
        })

    })
    .then (res => res.json())
    .then ((newQuote) => {
        newQuote.likes=[]//because my new quote object doesnt have a likes array (like other quote objects)
        turnQuotesIntoHTML(newQuote) //this is how the newQuote will be added to DOM
    })

})
//now we want to turn json into HTML
//Each quote should have the following structure(from readme)

function turnQuotesIntoHTML(quoteObj){
//start by creating the outermost element
    let outerElement=document.createElement('li')
    outerElement.className= "quote-card"
//fill the outermost element usin inner HTML

 //instead of usingpreprogrammed quote and author, add them from the quote list from json
    outerElement.innerHTML=`<blockquote class="blockquote">
    
  <p class="mb-0">${quoteObj.quote}</p>
  <footer class="blockquote-footer">${quoteObj.author}</footer>
  <br>
  <button class='btn-success'>Likes: <span>${quoteObj.likes.length}</span></button> 
  
  <button class='btn-danger'>Delete</button>
</blockquote>`
// ?? I dont understand why we are using .length above to count likes - see below
//each liek is actually an array of objects, so if there is one like, its an array of 1, 2 likes 
//is an array of 2, so if we get the length of that array we count the likes


//append the outermost element to the DOM
quotesList.append(outerElement)


//grab the element from the outer element
let deleteButton = outerElement.querySelector('.btn-danger')
/*Clicking the delete button should delete the respective quote from the API and remove it from the page without having to refresh.*/
let likeButton = outerElement.querySelector('.btn-success')
/*Clicking the like button will create a like for this particular quote in the API and update the number of likes displayed on the page without having to refresh.*/
let likesSpan = outerElement.querySelector('span') // i want to update an element in DOM, which means i need to fnd the element in DOM first


//ANYTIME THAT YOU ADD EVENT LISTENER INSIDE OF THE FUNCTION, THE ELEMENT YOU ADD IT TO HAS TO BE 
// AN ELEMENT YOU CREATED

//add event listeners 
deleteButton.addEventListener('click', ()=>{
    fetch('http://localhost:3000/quotes/${quoteObj.id}', {
// to delete smth we just need the ID, not the headers nor the body
        method: "DELETE"
    })
    .then (res=>res.json())
//we want to remove, what we deleted, from the DOM
    .then (()=>{
       outerElement.remove()
       })
  
})


///OPTIMISTIC VS PESSIMISTIC APPROACH:
//PESSIMISTIC: (the one above with .then)-   I am not sure if this fetch/delete will go through,
// let me wait until i get a response back (preferred way)
//OPTIMISTIC: i dont care if my fetch works, i am still gonna delete it anyway from DOM
/*fetch('http://localhost:3000/quotes/${quoteObj.id}', {
    method: "DELETE"
    outerElement.remove()
    })
*/
//Use a POST request to http://localhost:3000/likes
likeButton.addEventListener('click', () => {
    

    fetch('http://localhost:3000/likes', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
//The body of the request should be a JSON object containing a key of quoteId, with an integer value. Use the ID of the quote you're creating the like for — e.g. { quoteId: 5 } to create a like for quote 5.

        body: JSON.stringify({
            quoteId: quoteObj.id 
//i dont understand why quoteObj.id is actually the total number of likes when it seems it should be the id of the quote and why is it growing*

        }),
      })
    .then(res=>res.json())
    .then((newLike)=> {
        console.log(newLike);
        quoteObj.likes.push(newLike) // we are modifying an object in memory and we need to chnage
        //the number we see in span( DOM)
        likesSpan.innerText = quoteObj.likes.length
    })
    
    })
    

}


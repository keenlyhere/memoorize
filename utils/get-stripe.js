import { loadStripe } from "@stripe/stripe-js";

let stripePromise
const getStripe = ()=>{
    if(!stripePromise){
        console.log("Stripe Key: ", process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
    }
    return stripePromise
}

export default getStripe

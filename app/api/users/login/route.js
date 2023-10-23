import { NextResponse } from "next/server";
import Jwt from "jsonwebtoken";

// instead of mongo stuff here im using a plain object to make it easier to run this example
// you can replace this with your own mongo stuff
const Info = {
  findOne: ({ email }) => {
        if (email === "example@mail.com") {
           
            return {
                _id: "123",
                username: "example",
                email: "example@mail.com",
                password: "123456"
            }
        
    } else {
        return null
    }},
};

export const POST = async (req) => {
  const { email, password } = await req.json();

  try {
   

    //check if user exists
    const user = await Info.findOne({ email });
    if (!user) {
      return new Response("User does not exist!", { status: 400 });
    }

    //compare passwords
    /* const validPassword = await bcryptjs.compare(password, user.password); */ // this is the bcryptjs version im gonna skip this for now
    const validPassword = password === user.password;
    if (!validPassword) {
      return new Response("Invalid password!", { status: 401 });
    }

    //create token data
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    //create jwt token
    const token = Jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    console.log(error);
    return new Response("Error! Something went wrong.", { status: 500 });
  }
};
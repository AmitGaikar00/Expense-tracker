import User from "../models/User";

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check whether the user exists or not
    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User have already registered");
    }

    // creating a new user
    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      throw new Error("Email not found");
    }

    if (await user.comparePassword(password)) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: await user.generateJWT(),
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser };

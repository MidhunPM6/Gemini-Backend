import SubscriptionUseCase from "../use-cases/payment/subscriptionUseCase.js";
import StatusCodes from "../utils/statusCodes.js";

export const subscriptionController = async (req, res) => {
    const {email} = req.user
    console.log(email);
     
    try {
        const subscriptionUseCase = new SubscriptionUseCase();
        const response = await subscriptionUseCase.execute(email);
        return res
            .status(StatusCodes.OK)
            .json({ success: true, data:response ,message: "Subscription created successfully" });

    } catch (error) {
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ success: false, message: error.message });
    }
};
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const BuyCredit = () => {
  const { user, backendURL, loadUserData, token, setShowForm } =
    useContext(AppContext);
  const navigate = useNavigate();

  const initializePayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Purchase Credits",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          await axios.post(`${backendURL}/api/user/verify-razor`, response, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          await loadUserData();
          navigate("/");
          toast.success("Credits Added Successfully!");
        } catch (error) {
          console.error(error);
          toast.error(error.response?.data?.error || "Verification Failed");
        }
      },
      theme: { color: "#1F2937" },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (err) => {
      console.error("Payment Failed:", err.error);
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
  };

  const handlePayment = async (planId) => {
    if (!user) {
      setShowForm(true);
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendURL}/api/user/pay-razor`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      initializePayment(data.order);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Unable to initiate payment");
    }
  };
  return (
    <motion.div
      className="min-h-[80vh] text-center pt-14 mb-10"
      initial={{ opacity: 0.2, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <span className="block w-max mx-auto border border-[#C1C1C1] px-10 py-2 rounded-full mb-6 uppercase bg-[#F7FBFF] text-[#515151] text-sm">
        Our Plans
      </span>
      <h1 className="text-3xl font-semibold mb-10">Choose the plan</h1>

      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm rounded-lg py-10 px-8 text-gray-600 hover:scale-105 transition-transform duration-500 border border-[#EDEDED] max-w-xs"
          >
            <img src={assets.logo_icon} alt="logo" width={30} />
            <h3 className="mt-4 mb-1 font-medium text-xl">{plan.id}</h3>
            <p className="text-sm">{plan.desc}</p>
            <h2 className="mt-6">
              <span className="text-3xl font-medium">₹{plan.price}</span> /{" "}
              {plan.credits} credits
            </h2>
            <button
              onClick={() => handlePayment(plan.id)}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white mt-8 text-sm rounded-md py-2.5 min-w-52 transition-all"
            >
              {user ? "Purchase" : "Get started"}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default BuyCredit;

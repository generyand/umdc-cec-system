import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

const App = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen text-3xl font-bold">
      <p className="mb-4">Hello, World! 🚀</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button>Click me</Button>
      </motion.div>
    </div>
  );
};

export default App;

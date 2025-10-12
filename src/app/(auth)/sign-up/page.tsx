"use client";

import { signUpSchema } from "@/schemas/signUpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import axios, { AxiosError } from "axios";
import z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react"; // Make sure this is installed
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [formData, setFormData] = useState({
    isCheckingUsername: false,
    isUsernameAvailable: false,
    isSubmittingForm: false,
  });

  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // ✅ Corrected API Response Handling
  useEffect(() => {
    if (username) {
      const checkUsername = async () => {
        setFormData((prev) => ({ ...prev, isCheckingUsername: true }));
        setUsernameMessage("");

        try {
          const res = await axios.get(
            `/api/check-username?username=${username}`
          );
          const { success, message } = res.data;

          setFormData((prev) => ({
            ...prev,
            isUsernameAvailable: success,
          }));

          setUsernameMessage(message || "Unknown response");
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const errorMessage =
            axiosError?.response?.data?.message || "Something went wrong";
          setUsernameMessage(errorMessage);
        } finally {
          setFormData((prev) => ({ ...prev, isCheckingUsername: false }));
        }
      };

      checkUsername();
    } else {
      setUsernameMessage("");
    }
  }, [username]);

  const onSubmit = async (payload: z.infer<typeof signUpSchema>) => {
    setFormData((prev) => ({ ...prev, isSubmittingForm: true }));

    // If username is not available, don't submit the form
    if (!formData.isUsernameAvailable) {
      toast.error("Username is already taken.");
      setFormData((prev) => ({ ...prev, isSubmittingForm: false }));
      return;
    }

    try {
      const response = await axios.post("/api/sign-up", payload);
      const { data } = response;
      if (data.success) {
        toast(data.message);
        router.push(`/verify/${username}`);
      }
      // Optionally redirect or show success message
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setFormData((prev) => ({ ...prev, isSubmittingForm: false }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Anonymous Feedback
          </h1>
          <p className="mb-4 text-gray-600">Sign up to start your journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username */}
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {/* Loader + Message for username availability check */}
                  {(formData.isCheckingUsername || usernameMessage) && (
                    <div className="flex items-center gap-2 min-h-[1.5rem]">
                      {formData.isCheckingUsername && (
                        <Loader2 className="animate-spin w-4 h-4 text-gray-500" />
                      )}
                      {!formData.isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-sm ${
                            formData.isUsernameAvailable
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Only render FormMessage if there's no custom usernameMessage */}
                  {!usernameMessage && <FormMessage />}
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={
                formData.isCheckingUsername ||
                formData.isSubmittingForm ||
                !form.formState.isValid // Disable submit if the form is not valid
              }
              className="w-full"
            >
              {formData.isSubmittingForm ? "Submitting..." : "Signup"}
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

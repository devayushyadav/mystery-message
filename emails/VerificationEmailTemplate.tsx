import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
  username: string;
}

export const OtpEmail: React.FC<OtpEmailProps> = ({ otp, username }) => {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Code for Verification</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Verify Your Account</Text>

          <Text style={paragraph}>
            Hi <strong>{username}</strong>,
          </Text>

          <Text style={paragraph}>
            Please use the following OTP to complete your verification process:
          </Text>

          <Section style={otpBox}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          <Text style={paragraph}>
            This OTP is valid for 10 minutes. If you didn’t request this, you
            can safely ignore this email.
          </Text>

          <Text style={paragraph}>
            Thanks, <br />
            <strong>Your Company Team</strong>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default OtpEmail;

// ---------- Styles ----------
const main = {
  backgroundColor: "#f4f4f7",
  padding: "20px 0",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  maxWidth: "500px",
  margin: "0 auto",
  border: "1px solid #eaeaea",
};

const heading = {
  fontSize: "20px",
  fontWeight: "bold",
  textAlign: "center" as const,
  marginBottom: "20px",
  color: "#333333",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "20px",
  color: "#555555",
};

const otpBox = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const otpText = {
  display: "inline-block",
  fontSize: "24px",
  fontWeight: "bold",
  letterSpacing: "6px",
  color: "#007bff",
};

import { Box, Divider, Stack, Typography } from "@mui/material";
import {
  AddressElement,
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { FC, useState } from "react";

import BackIcon from "~community/common/assets/Icons/BackIcon";
import {
  ButtonSizes,
  ButtonStyle
} from "~community/common/enums/ComponentEnums";
import { useToast } from "~community/common/providers/ToastProvider";
import { theme } from "~community/common/theme/theme";
import { IconName } from "~community/common/types/IconTypes";
import { useCreateSubscription } from "~enterprise/common/api/paymentApi";
import { BillingDetailsType } from "~enterprise/common/types/billing";

import Button from "../../atoms/Button/Button";
import Icon from "../../atoms/Icon/Icon";
import InputField from "../../molecules/InputField/InputField";

const BillingForm: FC<{
  pricingPlan: string;
  price: number;
  setIsConfirmDialogOpen: (open: boolean) => void;
  employeeCount?: number;
}> = ({ pricingPlan, price, setIsConfirmDialogOpen, employeeCount }) => {
  const [billingDetails, setBillingDetails] = useState<BillingDetailsType>();
  const [holderName, setHolderName] = useState<string>();
  //   const [email, setEmail] = useState<string>();
  // const [taxId, setTaxId] = useState<string>();
  // const [taxType, setTaxType] = useState<TaxType>({
  //   value: "",
  //   label: "ID Type"
  // });
  const email = "hasala002@gmail.com";
  const elements = useElements();
  const stripe = useStripe();
  const { setToastMessage } = useToast();
  const {
    mutate: createSubscription,
    isPending,
    isError,
    error
  } = useCreateSubscription();

  const handleSubmit = async () => {
    try {
      // Create PaymentMethod
      if (!stripe || !elements) return;

      const cardNumberElement = elements.getElement(CardNumberElement);
      const cardExpiryElement = elements.getElement(CardExpiryElement);
      const cardCvcElement = elements.getElement(CardCvcElement);

      if (!cardNumberElement || !cardExpiryElement || !cardCvcElement) return;

      const { error: paymentMethodError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumberElement,
          billing_details: {
            name: holderName,
            email,
            address: billingDetails?.address
          }
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      // Create subscription
      createSubscription(
        {
          paymentMethodId: paymentMethod.id,
          email,
          name: holderName,
          pricingPlan,
          billingDetails,
          employeeCount
        },
        {
          onSuccess: (data) => {
            setToastMessage({
              open: true,
              toastType: "success",
              title: "Subscription Created",
              description: "Your subscription has been created successfully.",
              isIcon: true
            });
            setIsConfirmDialogOpen(false);
          },
          onError: (err) => {
            console.error("Error creating subscription:", err);
          }
        }
      );

      // onSuccess();
    } catch (error) {
      // setErrorMessage(error.message || 'An unexpected error occurred');
      // onError(error.message || 'An unexpected error occurred');
    } finally {
      // setIsProcessing(false);
    }
  };

  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        gap={"1.125rem"}
        sx={{ backgroundColor: theme.palette.grey[50] }}
      >
        <Stack direction={"column"} gap={"1.125rem"}>
          {/* Payment Details Section */}
          <Box sx={{ backgroundColor: undefined }}>
            <Box
              component="div"
              sx={{
                height: "auto",
                cursor: "pointer",
                width: "2.25rem"
              }}
              onClick={() => {
                setIsConfirmDialogOpen(false);
              }}
            >
              <BackIcon />
            </Box>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                pt: "1.875rem",
                pb: "1rem"
              }}
            >
              {"Confirm your plan"}
            </Typography>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "400",
                mb: "3.875rem",
                color: theme.palette.text.secondary
              }}
            >
              {"Please review and verify your current subscription details."}
            </Typography>
          </Box>

          <Box
            sx={{
              width: "39.0625rem",
              p: "3.5rem",
              backgroundColor: "common.white",
              borderRadius: "1rem"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                {"Payment Details"}
              </Typography>
              <Divider sx={{ mt: "1.0625rem", mb: "1.0625rem" }} />
            </Box>
            <Typography sx={{ fontSize: "1rem", fontWeight: 400 }}>
              {"Card number"}
            </Typography>
            <Box
              sx={{
                backgroundColor: "grey.100",
                p: "0.75rem",
                borderRadius: "0.375rem",
                mt: "0.5rem",
                mb: "1.625rem",
                fontSize: "1.625rem"
              }}
            >
              <CardNumberElement
                options={{
                  showIcon: true,
                  iconStyle: "solid",
                  style: { base: { fontSize: "1rem" } },
                  placeholder: "5350 **** **** ****"
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Typography sx={{ fontSize: "0.9375rem", fontWeight: 400 }}>
                {"Expiry"}
                <Box
                  sx={{
                    backgroundColor: "grey.100",
                    p: "0.75rem",
                    borderRadius: "0.375rem",
                    mt: "0.5rem",
                    mb: "1.625rem",
                    fontSize: "1.625rem",
                    width: "15.625rem"
                  }}
                >
                  <CardExpiryElement
                    options={{ style: { base: { fontSize: "1rem" } } }}
                  />
                </Box>
              </Typography>

              <Typography sx={{ fontSize: "0.9375rem", fontWeight: 400 }}>
                {"CVC"}
                <Box
                  sx={{
                    backgroundColor: "grey.100",
                    p: "0.75rem",
                    borderRadius: "0.375rem",
                    mt: "0.5rem",
                    mb: "1.625rem",
                    fontSize: "1.625rem",
                    width: "15.625rem"
                  }}
                >
                  <CardCvcElement
                    options={{
                      style: {
                        base: {
                          fontSize: "1rem",
                          "::placeholder": { color: "#eeeeee" }
                        }
                      }
                    }}
                  />
                </Box>
              </Typography>
            </Box>

            <Typography sx={{ fontSize: "1rem", fontWeight: 400 }}>
              {"Cardholder name"}
            </Typography>
            <InputField
              inputName=""
              value={holderName}
              onChange={(e) => setHolderName(e.currentTarget.value)}
            />
            <Typography
              sx={{
                fontSize: "0.875rem",
                fontWeight: 400,
                pt: "1.25rem",
                color: "grey.400"
              }}
            >
              {
                "By saving your card information, you allow MyLeave to charge your card for future payments in accordance with their terms."
              }
            </Typography>
          </Box>

          {/* Billing Details Section */}
          <Box
            sx={{
              width: "39.0625rem",
              p: "3.5rem",
              backgroundColor: "common.white",
              borderRadius: "1rem"
            }}
          >
            <Box>
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
                {"Billing Details"}
              </Typography>
              <Divider sx={{ mt: "1.0625rem", mb: "1.0625rem" }} />
            </Box>

            <AddressElement
              options={{
                mode: "billing",
                display: { name: "organization" },
                autocomplete: { mode: "automatic" },
                defaultValues: {
                  name: "Hasala",
                  address: {
                    country: "Sri Lanka",
                    city: "Kekanadura",
                    line1: "No 1",
                    line2: "Matara",
                    state: "Southern",
                    postal_code: "80000"
                  }
                }
              }}
              onChange={(event) => {
                setBillingDetails({
                  ...event.value,
                  address: {
                    ...event.value.address,
                    line2: event.value.address.line2 || ""
                  }
                });
              }}
            />

            <Typography
              sx={{ fontSize: "0.9375rem", fontWeight: 400, pt: "0.625rem" }}
            >
              {"Email"}
            </Typography>
            {/* <InputField
              inputName=""
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            /> */}
            <InputField
              inputName=""
              value={email}
              isDisabled={true}
              onChange={() => {}}
            />
          </Box>
        </Stack>
        <Stack
          spacing={3}
          sx={{
            width: "39.0625rem",
            p: "3.5rem",
            backgroundColor: "common.white",
            mt: "15rem",
            borderRadius: "1rem",
            height: "fit-content"
          }}
        >
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 500 }}>
            {"Your Plan"}
          </Typography>
          <Divider sx={{ mt: "0.8125rem", mb: "0.8125rem" }} />
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "25rem",
              color: theme.palette.text.secondary
            }}
          >
            {"You can select the number of users to see the total price"}
          </Typography>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            sx={{ mb: "6.1875rem" }}
          >
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "25rem"
              }}
            >
              {"Total"}
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "37.5rem"
              }}
            >
              {"$"} {price * (employeeCount || 1)}
            </Typography>
          </Stack>
          <Button
            buttonStyle={ButtonStyle.PRIMARY}
            label={"Confirm"}
            endIcon={<Icon name={IconName.RIGHT_ARROW_ICON} />}
            size={ButtonSizes.MEDIUM}
            isLoading={isPending}
            onClick={() => {
              handleSubmit();
            }}
          />
          <Typography
            sx={{
              fontSize: "0.875rem",
              fontWeight: "25rem"
            }}
          >
            {`By clicking "Confirm", you agree to the Subscriber Terms. Your subscription will renew automatically by charging your payment method on file until you cancel. You may cancel at any time prior to the next billing cycle.`}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
};

export default BillingForm;

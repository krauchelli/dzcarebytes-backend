# Recap: DzCareBytes Payment Gateway Integration Plan

The goal is to handle payment link management (leveraging DOKU Sandbox via a previous project) and simulate/process payment status updates (Successful, Failed, Pending) with callbacks updating the `Billing` status in the DzCareBytes backend.

---

## I. Project Structure Additions

To maintain organization and modularity within the Express.js application:

* **New Module:** Introduce a `paymentModule`.
    * **Location:** `src/modules/paymentModule/`
    * **Components:**
        * `payment.controller.js`: Manages incoming HTTP requests.
            * Endpoint for DOKU Sandbox callbacks (e.g., `POST /api/payments/callback/doku`) for payment status updates.
            * (Optional) Endpoints for manually simulating payment states for testing (e.g., `POST /api/billing/:billingId/simulate-payment/:status`).
        * `payment.service.js`: Houses the business logic for:
            * Validating callback data.
            * Updating `Billing` records in the database based on payment status.
            * Interacting with any DOKU-related logic or data transformation if needed.
        * `payment.routes.js`: Defines API routes specific to payment functionalities and links them to the controller.
        * `payment.validation.js` (Optional): For defining request validation schemas (e.g., using Joi or express-validator) for payment-related endpoints.
    * **Integration:** This module's routes will be registered in the main application router (e.g., `src/routes/index.js` or `src/app.js`).

---

## II. Prisma Model Modifications (`Billing` Model)

The primary model affected is `Billing`. No new dedicated payment models are strictly required for the defined scope, prioritizing simplicity.

* **Model:** `Billing`
* **Recommended Fields & Enhancements:**

    | Field                            | Type             | Attributes & Purpose                                                                                                |
    | :------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------ |
    | `id`                             | `Int`            | `@id @default(autoincrement())` (Existing)                                                                          |
    | `patient_id`                     | `Int`            | (Existing)                                                                                                          |
    | `medicine_price`                 | `Decimal`        | (Existing)                                                                                                          |
    | `scheduling_price`               | `Decimal`        | (Existing)                                                                                                          |
    | `total_price`                    | `Decimal`        | (Existing)                                                                                                          |
    | `status`                         | `Status_Billing` | (Existing Enum) `@default(Pending)` - Defaulting to `Pending` is recommended.                                     |
    | `payment_link`                   | `String?`        | (Existing, now Optional) Stores the DOKU payment link. Optional if a bill can exist before the link is generated. |
    | `payment_gateway_transaction_id` | `String?`        | **(New)** Stores DOKU's unique transaction/invoice ID for reconciliation and idempotency.                         |
    | `payment_method`                 | `String?`        | **(New, Optional)** Stores payment method if provided by DOKU (e.g., 'credit_card').                               |
    | `notes`                          | `String?`        | **(New, Optional)** For additional notes from the gateway or internal remarks.                                    |
    | `createdAt`                      | `DateTime`       | **(New)** `@default(now())` - Tracks when the billing record was created.                                         |
    | `updatedAt`                      | `DateTime`       | **(New)** `@updatedAt` - Tracks the last update to the billing record.                                            |
    | `payment_processed_at`           | `DateTime?`      | **(New)** Timestamp for when payment status became `Paid` or `Failed`.                                              |

* **Next Steps for Schema (in `prisma/schema.prisma`):**
    1.  Implement the changes in the `Billing` model as detailed above.
    2.  Run `npx prisma generate` to update the Prisma Client.
    3.  Run `npx prisma migrate dev --name add_payment_fields_to_billing` (or a similarly descriptive name) to create and apply the database migration.

---

This structured approach should allow for effective integration of the demo payment gateway functionalities while maintaining a well-organized codebase and a robust database schema with necessary tracking fields.
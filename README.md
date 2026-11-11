# Menke Excavating LLC — Website & Owner Editor

Fast, mobile-first website with a built-in **Visual Owner Editor (`/admin`)** and **Netlify Lead Forms** — running at **$0/month** on Netlify.

---

## 1. Editing the Website (`/admin`)

Open **`https://<your-site>.netlify.app/admin/`** to launch the split-screen Visual Website Editor:

1. **Phones & Info:** Edit the top announcement bar, Steve's cell phone, office phone, mailing address, and footer summary.
2. **Hero & Stats:** Edit the location badge, main headline, subtitle, background photo, and the 4 highlight stat boxes.
3. **Services:** Add, reorder, edit, or remove services across all 4 categories, and pick from built-in photos or upload new photos.
4. **Photo Gallery:** Upload new job-site photos directly from your phone or computer (automatically resized & compressed for fast loading), edit captions, change filter categories, or reorder photos.
5. **About Steve:** Update company story, owner bio, and section photo.
6. **Careers:** Add or remove open positions, toggle `HIRING` / `FILLED` badges, and update application email or PDF link.

Click **Save & Publish Live** in the top-right corner — updates go live across the website immediately.

---

## 2. Inviting the Business Owner by Email (Netlify Identity)

To give the company owner their own email & password login for `/admin`:

1. In your **Netlify Dashboard**, open the site and go to **Integrations → Identity** (or **Site configuration → Identity**) and click **Enable Identity**.
2. Under **Registration preferences**, select **Invite only**.
3. Go to the **Identity** tab and click **Invite users** → enter the owner's email address.
4. They will receive an invitation email, click the link to set their password, and automatically land inside `/admin`.

*(Before Netlify Identity is enabled, `/admin` uses the starter passcode `menke2026`, or a custom passcode set via the `ADMIN_PIN` environment variable in Netlify.)*

---

## 3. Estimate Form Leads

Customer submissions from the **Request a Free Estimate** form are captured automatically in **Netlify → Forms → `estimate`** (you can add email notifications under **Forms → Form notifications** so leads go straight to the owner's inbox).


// Client-side Cloud/Demo Backend Fallback for Static Hosting (Netlify)
// Automatically provides full end-to-end persistence in localStorage when no Spring Boot server is connected.

const DB_KEY = "foodloop_cloud_db_v1";

function hoursFromNow(h) {
  return new Date(Date.now() + h * 3600 * 1000).toISOString();
}

function createInitialDb() {
  return {
    nextIds: {
      user: 7,
      donation: 6,
      request: 4,
      assignment: 2,
      notification: 7,
    },
    users: [
      {
        userId: 1,
        name: "System Administrator",
        email: "admin@foodloop.com",
        passwords: ["Admin@123", "admin123"],
        role: "ADMIN",
        phone: "9900011223",
        address: "FoodLoop HQ, Tech Center",
        organizationName: "FoodLoop Foundation",
        verified: true,
        createdAt: hoursFromNow(-720),
      },
      {
        userId: 2,
        name: "Grand Feast Hotel",
        email: "donor@foodloop.com",
        passwords: ["Donor@123", "donor123"],
        role: "DONOR",
        phone: "9876543210",
        address: "124 Park Avenue, Jubilee Hills, Hyderabad",
        organizationName: "Grand Feast Hospitality",
        verified: true,
        createdAt: hoursFromNow(-360),
      },
      {
        userId: 3,
        name: "Feed The Hungry Foundation",
        email: "ngo@foodloop.com",
        passwords: ["Ngo@123", "ngo123"],
        role: "NGO",
        phone: "9876543211",
        address: "45 Hope Road, Secunderabad",
        organizationName: "Feed The Hungry Society",
        verified: true,
        createdAt: hoursFromNow(-240),
      },
      {
        userId: 4,
        name: "Community Care Trust",
        email: "care.ngo@foodloop.com",
        passwords: ["Ngo@123", "ngo123"],
        role: "NGO",
        phone: "9876543212",
        address: "89 River View, East District, Hyderabad",
        organizationName: "Community Care Trust",
        verified: false,
        createdAt: hoursFromNow(-24),
      },
      {
        userId: 5,
        name: "Alex Sharma",
        email: "volunteer@foodloop.com",
        passwords: ["Volunteer@123", "volunteer123"],
        role: "VOLUNTEER",
        phone: "9876543213",
        address: "Flat 302, Green Meadows, Hyderabad",
        organizationName: "",
        verified: true,
        createdAt: hoursFromNow(-168),
      },
      {
        userId: 6,
        name: "Ruthvik Sriram",
        email: "ruthviksriram4@gmail.com",
        passwords: ["Password@123", "Ruthvik@2007"],
        role: "DONOR",
        phone: "9848012345",
        address: "SR University Campus, Warangal, Telangana",
        organizationName: "FoodLoop Community Kitchen",
        verified: true,
        createdAt: hoursFromNow(-120),
      },
    ],
    donations: [
      {
        donationId: 1,
        donorId: 2,
        foodName: "Vegetable Dum Biryani",
        foodDescription:
          "Freshly cooked aromatic vegetable biryani packed in individual containers.",
        foodCategory: "VEGETARIAN",
        quantity: 30,
        quantityUnit: "MEALS",
        preparedAt: hoursFromNow(-2),
        expiryTime: hoursFromNow(12),
        pickupAddress: "Grand Feast Kitchen, Back Entrance, 124 Park Ave",
        status: "AVAILABLE",
        createdAt: hoursFromNow(-1),
      },
      {
        donationId: 2,
        donorId: 2,
        foodName: "Assorted Bakery Breads & Buns",
        foodDescription:
          "Fresh bakery goods packaged from evening shift, including whole wheat bread and buns.",
        foodCategory: "BAKERY",
        quantity: 20,
        quantityUnit: "PACKETS",
        preparedAt: hoursFromNow(-4),
        expiryTime: hoursFromNow(24),
        pickupAddress: "Grand Feast Bakery Counter, 124 Park Ave",
        status: "AVAILABLE",
        createdAt: hoursFromNow(-3),
      },
      {
        donationId: 3,
        donorId: 2,
        foodName: "Paneer Butter Masala & Rotis",
        foodDescription:
          "Surplus buffet preparation from luncheon event, stored at food-safe warm temperatures.",
        foodCategory: "VEGETARIAN",
        quantity: 25,
        quantityUnit: "MEALS",
        preparedAt: hoursFromNow(-3),
        expiryTime: hoursFromNow(8),
        pickupAddress: "Grand Feast Hotel Main Reception, 124 Park Ave",
        status: "ACCEPTED",
        createdAt: hoursFromNow(-2),
      },
      {
        donationId: 4,
        donorId: 6,
        foodName: "Fresh Fruit & Millet Meal Boxes",
        foodDescription:
          "Nutritious campus canteen surplus packed neatly in sealed biodegradable boxes.",
        foodCategory: "VEGETARIAN",
        quantity: 40,
        quantityUnit: "BOXES",
        preparedAt: hoursFromNow(-1),
        expiryTime: hoursFromNow(10),
        pickupAddress: "SR University Main Dining Hall, Warangal",
        status: "AVAILABLE",
        createdAt: hoursFromNow(-1),
      },
      {
        donationId: 5,
        donorId: 6,
        foodName: "South Indian Rice & Sambar Packs",
        foodDescription:
          "Warm steamed rice, vegetable sambar, and curd packs ready for evening distribution.",
        foodCategory: "COOKED_MEALS",
        quantity: 35,
        quantityUnit: "PACKETS",
        preparedAt: hoursFromNow(-2),
        expiryTime: hoursFromNow(9),
        pickupAddress: "FoodLoop Community Kitchen, Hanamkonda",
        status: "ACCEPTED",
        createdAt: hoursFromNow(-2),
      },
    ],
    requests: [
      {
        requestId: 1,
        donationId: 3,
        ngoId: 3,
        requestedQuantity: 20,
        requestMessage:
          "We need dinner meals for our evening shelter residents in Secunderabad.",
        status: "ACCEPTED",
        requestedAt: hoursFromNow(-1),
      },
      {
        requestId: 2,
        donationId: 5,
        ngoId: 3,
        requestedQuantity: 35,
        requestMessage:
          "Needed urgently for community food drive near railway station.",
        status: "ACCEPTED",
        requestedAt: hoursFromNow(-1.5),
      },
      {
        requestId: 3,
        donationId: 1,
        ngoId: 3,
        requestedQuantity: 15,
        requestMessage: "For senior citizen care home lunch distribution.",
        status: "PENDING",
        requestedAt: hoursFromNow(-0.5),
      },
    ],
    assignments: [
      {
        assignmentId: 1,
        requestId: 1,
        volunteerId: 5,
        pickupStatus: "PENDING",
        deliveryStatus: "PENDING",
        assignedAt: hoursFromNow(-0.5),
        pickupTime: null,
        deliveryTime: null,
      },
    ],
    notifications: [
      {
        notificationId: 1,
        userId: 2,
        title: "Welcome to FoodLoop",
        message:
          "Your food donor account has been successfully initialized. Start sharing surplus meals!",
        notificationType: "ACCOUNT_REGISTERED",
        isRead: false,
        createdAt: hoursFromNow(-360),
      },
      {
        notificationId: 2,
        userId: 3,
        title: "Food Request Accepted",
        message:
          "Your request for Paneer Butter Masala & Rotis has been accepted by Grand Feast Hotel.",
        notificationType: "REQUEST_ACCEPTED",
        isRead: false,
        createdAt: hoursFromNow(-1),
      },
      {
        notificationId: 3,
        userId: 5,
        title: "New Volunteer Assignment",
        message:
          "You have been assigned to collect Paneer Butter Masala & Rotis from Grand Feast Hotel and deliver to Feed The Hungry Foundation.",
        notificationType: "VOLUNTEER_ASSIGNED",
        isRead: false,
        createdAt: hoursFromNow(-0.5),
      },
      {
        notificationId: 4,
        userId: 1,
        title: "Pending NGO Verification",
        message:
          "New organization 'Community Care Trust' is waiting for admin verification.",
        notificationType: "NGO_PENDING",
        isRead: false,
        createdAt: hoursFromNow(-24),
      },
      {
        notificationId: 5,
        userId: 6,
        title: "Welcome to FoodLoop, Ruthvik!",
        message:
          "Your personal donor account is active. You have 2 active surplus food listings.",
        notificationType: "ACCOUNT_REGISTERED",
        isRead: false,
        createdAt: hoursFromNow(-12),
      },
      {
        notificationId: 6,
        userId: 2,
        title: "New NGO Food Request",
        message:
          "Feed The Hungry Foundation requested 15 meals of Vegetable Dum Biryani.",
        notificationType: "REQUEST_CREATED",
        isRead: false,
        createdAt: hoursFromNow(-0.5),
      },
    ],
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.users)) {
        return parsed;
      }
    }
  } catch {
    // ignore storage errors
  }
  const initial = createInitialDb();
  saveDb(initial);
  return initial;
}

function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // ignore quota errors
  }
}

function sanitizeUser(u) {
  if (!u) return null;
  return {
    userId: u.userId,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    role: u.role,
    organizationName: u.organizationName || "",
    address: u.address || "",
    verified: Boolean(u.verified),
    createdAt: u.createdAt,
  };
}

function enrichDonation(db, d) {
  const donor = db.users.find((u) => u.userId === d.donorId);
  return {
    ...d,
    donorName: donor ? donor.name : "FoodLoop Donor",
    donorPhone: donor ? donor.phone : "",
    donorEmail: donor ? donor.email : "",
  };
}

function enrichRequest(db, r) {
  const donation = db.donations.find((d) => d.donationId === r.donationId);
  const ngo = db.users.find((u) => u.userId === r.ngoId);
  const donor = donation
    ? db.users.find((u) => u.userId === donation.donorId)
    : null;
  return {
    ...r,
    foodName: donation ? donation.foodName : "Food Item",
    quantityUnit: donation ? donation.quantityUnit : "MEALS",
    pickupAddress: donation ? donation.pickupAddress : "",
    ngoName: ngo ? ngo.name : "NGO Partner",
    ngoAddress: ngo ? ngo.address : "",
    ngoPhone: ngo ? ngo.phone : "",
    donorId: donation ? donation.donorId : null,
    donorName: donor ? donor.name : "FoodLoop Donor",
  };
}

function enrichAssignment(db, a) {
  const req = db.requests.find((r) => r.requestId === a.requestId);
  const donation = req
    ? db.donations.find((d) => d.donationId === req.donationId)
    : null;
  const donor = donation
    ? db.users.find((u) => u.userId === donation.donorId)
    : null;
  const ngo = req ? db.users.find((u) => u.userId === req.ngoId) : null;
  const volunteer = db.users.find((u) => u.userId === a.volunteerId);
  return {
    ...a,
    foodName: donation ? donation.foodName : "Food Donation",
    foodCategory: donation ? donation.foodCategory : "FOOD",
    quantity: req ? req.requestedQuantity : donation?.quantity || 0,
    quantityUnit: donation ? donation.quantityUnit : "MEALS",
    pickupAddress: donation ? donation.pickupAddress : "",
    donorName: donor ? donor.name : "FoodLoop Donor",
    donorPhone: donor ? donor.phone : "",
    ngoName: ngo ? ngo.name : "NGO Partner",
    ngoAddress: ngo ? ngo.address : "",
    ngoPhone: ngo ? ngo.phone : "",
    volunteerName: volunteer ? volunteer.name : "Volunteer",
    volunteerPhone: volunteer ? volunteer.phone : "",
  };
}

function addNotification(db, userId, title, message, type) {
  if (!userId) return;
  db.notifications.unshift({
    notificationId: db.nextIds.notification++,
    userId,
    title,
    message,
    notificationType: type || "SYSTEM",
    isRead: false,
    createdAt: new Date().toISOString(),
  });
}

function getCurrentUser(db) {
  try {
    const stored = JSON.parse(localStorage.getItem("foodloopUser") || "null");
    if (!stored || !stored.userId) return null;
    return db.users.find((u) => u.userId === Number(stored.userId)) || stored;
  } catch {
    return null;
  }
}

function makeError(status, message, config) {
  const err = new Error(message);
  err.isAxiosError = true;
  err.config = config;
  err.response = {
    status,
    statusText: String(status),
    data: { message },
    headers: {},
    config,
  };
  return Promise.reject(err);
}

function makeSuccess(data, config, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: "OK",
    headers: { "x-foodloop-mode": "cloud-demo" },
    config,
  });
}

export function handleMockRequest(config) {
  const db = loadDb();
  const method = (config.method || "get").toLowerCase();

  // Normalize URL relative to /api
  let rawUrl = config.url || "";
  rawUrl = rawUrl.replace(/^https?:\/\/[^/]+/, "");
  if (rawUrl.startsWith("/api")) {
    rawUrl = rawUrl.slice(4);
  }
  const [pathOnly, queryString] = rawUrl.split("?");
  const path = pathOnly.replace(/\/+$/, "") || "/";
  const params = new URLSearchParams(queryString || "");

  let body = config.data;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const currentUser = getCurrentUser(db);

  // ---------------- USERS ----------------
  if (method === "post" && path === "/users/login") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const user = db.users.find((u) => u.email.toLowerCase() === email);
    if (!user || !(user.passwords || []).includes(password)) {
      return makeError(
        401,
        "Invalid email or password. Please check your credentials.",
        config
      );
    }
    const token = `foodloop-cloud-jwt-${user.userId}-${Date.now()}`;
    return makeSuccess({ token, user: sanitizeUser(user) }, config);
  }

  if (method === "post" && path === "/users/register") {
    const email = String(body.email || "").trim().toLowerCase();
    if (!email || !body.password || !body.name) {
      return makeError(400, "Name, email, and password are required.", config);
    }
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return makeError(400, "An account with this email already exists.", config);
    }
    const role = (body.role || "DONOR").toUpperCase();
    const newUser = {
      userId: db.nextIds.user++,
      name: body.name.trim(),
      email,
      passwords: [String(body.password).trim()],
      phone: body.phone || "",
      role,
      organizationName: body.organizationName || "",
      address: body.address || "",
      verified: role !== "NGO",
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    addNotification(
      db,
      newUser.userId,
      "Welcome to FoodLoop!",
      role === "NGO"
        ? "Your NGO account has been registered and is pending admin verification."
        : "Your FoodLoop account is active and ready to use.",
      "ACCOUNT_REGISTERED"
    );
    if (role === "NGO") {
      db.users
        .filter((u) => u.role === "ADMIN")
        .forEach((admin) =>
          addNotification(
            db,
            admin.userId,
            "Pending NGO Verification",
            `New NGO '${newUser.name}' registered and awaits verification.`,
            "NGO_PENDING"
          )
        );
    }
    saveDb(db);
    return makeSuccess(sanitizeUser(newUser), config, 201);
  }

  if (method === "get" && path === "/users/profile") {
    if (!currentUser) {
      return makeError(401, "Not authenticated.", config);
    }
    return makeSuccess(sanitizeUser(currentUser), config);
  }

  if (method === "get" && path === "/users/volunteers") {
    const vols = db.users
      .filter((u) => u.role === "VOLUNTEER")
      .map(sanitizeUser);
    return makeSuccess(vols, config);
  }

  if (method === "get" && path === "/users") {
    return makeSuccess(db.users.map(sanitizeUser), config);
  }

  const userDeleteMatch = path.match(/^\/users\/(\d+)$/);
  if (method === "delete" && userDeleteMatch) {
    const uid = Number(userDeleteMatch[1]);
    db.users = db.users.filter((u) => u.userId !== uid);
    saveDb(db);
    return makeSuccess("User deleted successfully!", config);
  }

  // ---------------- ADMIN ----------------
  const verifyNgoMatch = path.match(/^\/admin\/ngos\/(\d+)\/verify$/);
  if (method === "put" && verifyNgoMatch) {
    const uid = Number(verifyNgoMatch[1]);
    const target = db.users.find((u) => u.userId === uid);
    if (!target) return makeError(404, "User not found.", config);
    target.verified = true;
    addNotification(
      db,
      target.userId,
      "NGO Verified!",
      "Your NGO account has been verified by the administrator. You can now request surplus food.",
      "NGO_VERIFIED"
    );
    saveDb(db);
    return makeSuccess(sanitizeUser(target), config);
  }

  const toggleUserMatch = path.match(/^\/admin\/users\/(\d+)\/status$/);
  if (method === "put" && toggleUserMatch) {
    const uid = Number(toggleUserMatch[1]);
    const target = db.users.find((u) => u.userId === uid);
    if (!target) return makeError(404, "User not found.", config);
    target.verified = !target.verified;
    saveDb(db);
    return makeSuccess(sanitizeUser(target), config);
  }

  if (method === "get" && path === "/admin/reports") {
    const now = Date.now();
    const expiredDonations = db.donations.filter(
      (d) =>
        d.status === "EXPIRED" ||
        (d.status === "AVAILABLE" && d.expiryTime && new Date(d.expiryTime).getTime() < now)
    ).length;

    return makeSuccess(
      {
        totalDonations: db.donations.length,
        deliveredDonations: db.donations.filter((d) => d.status === "DELIVERED").length,
        availableDonations: db.donations.filter((d) => d.status === "AVAILABLE").length,
        expiredDonations,
        totalRequests: db.requests.length,
        pendingRequests: db.requests.filter((r) => r.status === "PENDING").length,
        acceptedRequests: db.requests.filter((r) => r.status === "ACCEPTED").length,
        rejectedRequests: db.requests.filter((r) => r.status === "REJECTED").length,
        collectedPickups: db.assignments.filter(
          (a) => a.pickupStatus === "COLLECTED" && a.deliveryStatus !== "DELIVERED"
        ).length,
        completedDeliveries: db.assignments.filter(
          (a) => a.deliveryStatus === "DELIVERED"
        ).length,
        totalUsers: db.users.length,
        totalDonors: db.users.filter((u) => u.role === "DONOR").length,
        totalNgos: db.users.filter((u) => u.role === "NGO").length,
        verifiedNgos: db.users.filter((u) => u.role === "NGO" && u.verified).length,
        pendingNgos: db.users.filter((u) => u.role === "NGO" && !u.verified).length,
        totalVolunteers: db.users.filter((u) => u.role === "VOLUNTEER").length,
      },
      config
    );
  }

  // ---------------- DONATIONS ----------------
  if (method === "get" && path === "/donations/available") {
    const list = db.donations
      .filter((d) => d.status === "AVAILABLE")
      .map((d) => enrichDonation(db, d));
    return makeSuccess(list, config);
  }

  const donorDonationsMatch = path.match(/^\/donations\/donor\/(\d+)$/);
  if (method === "get" && donorDonationsMatch) {
    const donorId = Number(donorDonationsMatch[1]);
    const list = db.donations
      .filter((d) => d.donorId === donorId)
      .map((d) => enrichDonation(db, d));
    return makeSuccess(list, config);
  }

  if (method === "get" && path === "/donations") {
    return makeSuccess(
      db.donations.map((d) => enrichDonation(db, d)),
      config
    );
  }

  if (method === "post" && path === "/donations") {
    const donorId = Number(params.get("donorId")) || currentUser?.userId || 2;
    const newDonation = {
      donationId: db.nextIds.donation++,
      donorId,
      foodName: body.foodName || "Surplus Food",
      foodDescription: body.foodDescription || "",
      foodCategory: body.foodCategory || "VEGETARIAN",
      quantity: Number(body.quantity) || 1,
      quantityUnit: body.quantityUnit || "PACKETS",
      preparedAt: body.preparedAt || new Date().toISOString(),
      expiryTime: body.expiryTime || hoursFromNow(12),
      pickupAddress: body.pickupAddress || "",
      status: "AVAILABLE",
      createdAt: new Date().toISOString(),
    };
    db.donations.unshift(newDonation);
    addNotification(
      db,
      donorId,
      "Donation Listed",
      `Your food donation '${newDonation.foodName}' is now live for verified NGOs.`,
      "DONATION_CREATED"
    );
    saveDb(db);
    return makeSuccess(enrichDonation(db, newDonation), config, 201);
  }

  const donationIdMatch = path.match(/^\/donations\/(\d+)$/);
  if (method === "put" && donationIdMatch) {
    const id = Number(donationIdMatch[1]);
    const target = db.donations.find((d) => d.donationId === id);
    if (!target) return makeError(404, "Donation not found.", config);
    Object.assign(target, {
      foodName: body.foodName ?? target.foodName,
      foodDescription: body.foodDescription ?? target.foodDescription,
      foodCategory: body.foodCategory ?? target.foodCategory,
      quantity: body.quantity ? Number(body.quantity) : target.quantity,
      quantityUnit: body.quantityUnit ?? target.quantityUnit,
      preparedAt: body.preparedAt ?? target.preparedAt,
      expiryTime: body.expiryTime ?? target.expiryTime,
      pickupAddress: body.pickupAddress ?? target.pickupAddress,
    });
    saveDb(db);
    return makeSuccess(enrichDonation(db, target), config);
  }

  if (method === "delete" && donationIdMatch) {
    const id = Number(donationIdMatch[1]);
    db.donations = db.donations.filter((d) => d.donationId !== id);
    db.requests = db.requests.filter((r) => r.donationId !== id);
    saveDb(db);
    return makeSuccess("Donation deleted successfully", config);
  }

  // ---------------- REQUESTS ----------------
  const ngoReqMatch = path.match(/^\/requests\/ngo\/(\d+)$/);
  if (method === "get" && ngoReqMatch) {
    const ngoId = Number(ngoReqMatch[1]);
    const list = db.requests
      .filter((r) => r.ngoId === ngoId)
      .map((r) => enrichRequest(db, r));
    return makeSuccess(list, config);
  }

  const donorReqMatch = path.match(/^\/requests\/donor\/(\d+)$/);
  if (method === "get" && donorReqMatch) {
    const donorId = Number(donorReqMatch[1]);
    const donorDonationIds = new Set(
      db.donations.filter((d) => d.donorId === donorId).map((d) => d.donationId)
    );
    const list = db.requests
      .filter((r) => donorDonationIds.has(r.donationId))
      .map((r) => enrichRequest(db, r));
    return makeSuccess(list, config);
  }

  if (method === "get" && path === "/requests") {
    return makeSuccess(
      db.requests.map((r) => enrichRequest(db, r)),
      config
    );
  }

  if (method === "post" && path === "/requests") {
    const ngoId = Number(params.get("ngoId")) || currentUser?.userId;
    const donation = db.donations.find(
      (d) => d.donationId === Number(body.donationId)
    );
    if (!donation) return makeError(404, "Donation not found.", config);
    const ngo = db.users.find((u) => u.userId === ngoId);
    const newReq = {
      requestId: db.nextIds.request++,
      donationId: donation.donationId,
      ngoId,
      requestedQuantity: Number(body.requestedQuantity) || 1,
      requestMessage: body.requestMessage || "",
      status: "PENDING",
      requestedAt: new Date().toISOString(),
    };
    db.requests.unshift(newReq);
    addNotification(
      db,
      donation.donorId,
      "New Food Request",
      `${ngo ? ngo.name : "An NGO"} requested ${newReq.requestedQuantity} ${donation.quantityUnit} of '${donation.foodName}'.`,
      "REQUEST_CREATED"
    );
    saveDb(db);
    return makeSuccess(enrichRequest(db, newReq), config, 201);
  }

  const reqActionMatch = path.match(/^\/requests\/(\d+)\/(accept|reject|cancel)$/);
  if (method === "put" && reqActionMatch) {
    const reqId = Number(reqActionMatch[1]);
    const action = reqActionMatch[2];
    const req = db.requests.find((r) => r.requestId === reqId);
    if (!req) return makeError(404, "Request not found.", config);
    const donation = db.donations.find((d) => d.donationId === req.donationId);

    if (action === "accept") {
      req.status = "ACCEPTED";
      if (donation) donation.status = "ACCEPTED";
      addNotification(
        db,
        req.ngoId,
        "Food Request Accepted",
        `Your request for '${donation?.foodName || "food"}' has been accepted by the donor!`,
        "REQUEST_ACCEPTED"
      );
    } else if (action === "reject") {
      req.status = "REJECTED";
      addNotification(
        db,
        req.ngoId,
        "Food Request Rejected",
        `Your request for '${donation?.foodName || "food"}' was declined by the donor.`,
        "REQUEST_REJECTED"
      );
    } else if (action === "cancel") {
      req.status = "CANCELLED";
    }
    saveDb(db);
    return makeSuccess(enrichRequest(db, req), config);
  }

  // ---------------- ASSIGNMENTS ----------------
  if (method === "get" && path === "/assignments/available") {
    const assignedReqIds = new Set(db.assignments.map((a) => a.requestId));
    const available = db.requests
      .filter((r) => r.status === "ACCEPTED" && !assignedReqIds.has(r.requestId))
      .map((r) => enrichRequest(db, r));
    return makeSuccess(available, config);
  }

  const assignVolMatch = path.match(/^\/assignments\/volunteer\/(\d+)$/);
  if (method === "get" && assignVolMatch) {
    const volId = Number(assignVolMatch[1]);
    const list = db.assignments
      .filter((a) => a.volunteerId === volId)
      .map((a) => enrichAssignment(db, a));
    return makeSuccess(list, config);
  }

  const assignReqMatch = path.match(/^\/assignments\/request\/(\d+)$/);
  if (method === "get" && assignReqMatch) {
    const reqId = Number(assignReqMatch[1]);
    const found = db.assignments.find((a) => a.requestId === reqId);
    if (!found) return makeSuccess(null, config);
    return makeSuccess(enrichAssignment(db, found), config);
  }

  if (method === "get" && path === "/assignments") {
    return makeSuccess(
      db.assignments.map((a) => enrichAssignment(db, a)),
      config
    );
  }

  if (method === "post" && path === "/assignments") {
    const reqId = Number(body.requestId);
    const volId = Number(body.volunteerId);
    if (db.assignments.some((a) => a.requestId === reqId)) {
      return makeError(400, "A volunteer is already assigned to this request.", config);
    }
    const newAssign = {
      assignmentId: db.nextIds.assignment++,
      requestId: reqId,
      volunteerId: volId,
      pickupStatus: "PENDING",
      deliveryStatus: "PENDING",
      assignedAt: new Date().toISOString(),
      pickupTime: null,
      deliveryTime: null,
    };
    db.assignments.unshift(newAssign);
    const enriched = enrichAssignment(db, newAssign);
    addNotification(
      db,
      volId,
      "New Volunteer Assignment",
      `You have been assigned to pick up '${enriched.foodName}' from ${enriched.donorName} and deliver to ${enriched.ngoName}.`,
      "VOLUNTEER_ASSIGNED"
    );
    saveDb(db);
    return makeSuccess(enriched, config, 201);
  }

  const claimMatch = path.match(/^\/assignments\/(\d+)\/claim$/);
  if (method === "post" && claimMatch) {
    const reqId = Number(claimMatch[1]);
    const volId = currentUser?.userId || 5;
    if (db.assignments.some((a) => a.requestId === reqId)) {
      return makeError(400, "This pickup has already been claimed.", config);
    }
    const newAssign = {
      assignmentId: db.nextIds.assignment++,
      requestId: reqId,
      volunteerId: volId,
      pickupStatus: "PENDING",
      deliveryStatus: "PENDING",
      assignedAt: new Date().toISOString(),
      pickupTime: null,
      deliveryTime: null,
    };
    db.assignments.unshift(newAssign);
    const enriched = enrichAssignment(db, newAssign);
    const req = db.requests.find((r) => r.requestId === reqId);
    if (req) {
      addNotification(
        db,
        req.ngoId,
        "Volunteer Assigned",
        `${enriched.volunteerName} has claimed the pickup for '${enriched.foodName}'.`,
        "VOLUNTEER_ASSIGNED"
      );
    }
    saveDb(db);
    return makeSuccess(enriched, config, 201);
  }

  const assignStatusMatch = path.match(/^\/assignments\/(\d+)\/(collect|deliver)$/);
  if (method === "put" && assignStatusMatch) {
    const assignId = Number(assignStatusMatch[1]);
    const action = assignStatusMatch[2];
    const assign = db.assignments.find((a) => a.assignmentId === assignId);
    if (!assign) return makeError(404, "Assignment not found.", config);
    const req = db.requests.find((r) => r.requestId === assign.requestId);
    const donation = req
      ? db.donations.find((d) => d.donationId === req.donationId)
      : null;

    if (action === "collect") {
      assign.pickupStatus = "COLLECTED";
      assign.pickupTime = new Date().toISOString();
      if (donation) donation.status = "PICKED_UP";
      if (req) {
        addNotification(
          db,
          req.ngoId,
          "Food Collected by Volunteer",
          `'${donation?.foodName || "Food"}' has been collected and is on its way to you.`,
          "PICKUP_COLLECTED"
        );
      }
    } else if (action === "deliver") {
      assign.pickupStatus = "COLLECTED";
      assign.deliveryStatus = "DELIVERED";
      assign.deliveryTime = new Date().toISOString();
      if (donation) donation.status = "DELIVERED";
      if (req) {
        addNotification(
          db,
          req.ngoId,
          "Food Delivered!",
          `'${donation?.foodName || "Food"}' has been delivered successfully.`,
          "DELIVERY_COMPLETED"
        );
      }
      if (donation) {
        addNotification(
          db,
          donation.donorId,
          "Donation Delivered!",
          `Your donation '${donation.foodName}' has been successfully delivered to the NGO.`,
          "DELIVERY_COMPLETED"
        );
      }
    }
    saveDb(db);
    return makeSuccess(enrichAssignment(db, assign), config);
  }

  // ---------------- NOTIFICATIONS ----------------
  const notifUserMatch = path.match(/^\/notifications\/user\/(\d+)$/);
  if (method === "get" && notifUserMatch) {
    const uid = Number(notifUserMatch[1]);
    const list = db.notifications.filter((n) => n.userId === uid);
    return makeSuccess(list, config);
  }

  const notifReadMatch = path.match(/^\/notifications\/(\d+)\/read$/);
  if (method === "put" && notifReadMatch) {
    const nid = Number(notifReadMatch[1]);
    const notif = db.notifications.find((n) => n.notificationId === nid);
    if (notif) {
      notif.isRead = true;
      saveDb(db);
    }
    return makeSuccess(notif || { notificationId: nid, isRead: true }, config);
  }

  return makeError(404, `Endpoint not found: ${method.toUpperCase()} ${path}`, config);
}

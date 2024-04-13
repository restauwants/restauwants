import type { z } from "zod";

import type { Database } from "@restauwants/db";
import type { RestaurantIdSchema } from "@restauwants/schema/atoms";
import type { RestaurantDetailsSchema } from "@restauwants/schema/server/internal";
import { eq, schema } from "@restauwants/db";
import { RestaurantSchema as RestaurantSchemaDatabase } from "@restauwants/schema/db";
import { GooglePlaceDetailsToRestaurantDetailsSchema } from "@restauwants/schema/server/internal";

export const withRestaurantCreationIfNecessary = async (
  db: Database,
  statement: (db: Database) => Promise<void>,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
) => {
  if (!(await doesRestaurantExist(db, restaurantId))) {
    const restaurantDetails = await getRestaurantDetails(restaurantId);
    await db.transaction(async (tx) => {
      await createRestaurant(tx, restaurantId, restaurantDetails);
      await statement(tx);
    });
  } else {
    await statement(db);
  }
};

const doesRestaurantExist = async (
  db: Database,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
): Promise<boolean> => {
  return (
    (await db.query.restaurant.findFirst({
      where: eq(schema.restaurant.id, restaurantId),
    })) !== undefined
  );
};

const getRestaurantDetails = async (
  restaurantId: z.infer<typeof RestaurantIdSchema>,
): Promise<z.infer<typeof RestaurantDetailsSchema>> => {
  return fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?fields=name%2Curl%2Cformatted_address&place_id=${restaurantId}&key=${process.env.GOOGLE_PLACES_API_KEY}`,
  )
    .then((res) => res.json())
    .then((json) => GooglePlaceDetailsToRestaurantDetailsSchema.parse(json));
};

const createRestaurant = async (
  db: Database,
  restaurantId: z.infer<typeof RestaurantIdSchema>,
  details: z.infer<typeof RestaurantDetailsSchema>,
): Promise<void> => {
  await db.insert(schema.restaurant).values(
    RestaurantSchemaDatabase.parse({
      id: restaurantId,
      name: details.name,
      address: details.address,
      url: details.url,
    }),
  );
};

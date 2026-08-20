import { z } from "zod";
import { BlogType } from "../../constants/enums";

export const BlogFiltereTypeEnum = z.object({
  type: z.coerce.number().pipe(
    z.nativeEnum(BlogType, {
      invalid_type_error:
        "Please select a valid blog type: 1 for featured, 2 for latest, 3 for normal.",
      required_error: "Type of blog is required",
    })
  ),
});

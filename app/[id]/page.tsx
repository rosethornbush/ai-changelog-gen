import { CopyButton } from "@/components/app/CopyButton"
import { MDXContent } from "@/components/app/MDXContent"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { getQueryClient } from "@/lib/getQueryClient"
import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const headersList = await headers()
  const protocol = headersList.get("x-forwarded-proto") || "http"
  const host = headersList.get("host")

  const queryClient = getQueryClient()
  const data = await queryClient.fetchQuery({
    queryKey: ["changelogs", id],
    queryFn: ({ queryKey }) => {
      return fetch(`${protocol}://${host}/api/${queryKey.join("/")}`).then(
        (r) => r.json()
      )
    },
  })

  const [owner] = data.repo.split("/")

  return (
    <div className="flex w-full flex-col gap-8">
      <Item variant="muted">
        <ItemMedia variant="image">
          <Link href={`https://github.com/${data.repo}`}>
            <Image
              layout="responsive"
              width={64}
              height={64}
              src={`https://github.com/${owner}.png`}
              alt={`${owner}`}
            />
          </Link>
        </ItemMedia>
        <ItemContent>
          <Link href={`https://github.com/${data.repo}`}>
            <ItemTitle className="text-lg leading-none font-semibold">
              {data.repo}
            </ItemTitle>
          </Link>
          <ItemDescription className="leading-none">
            {data.createdAt}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link href={`https://github.com/${data.repo}`} />}
          >
            <GithubLogoIcon weight="duotone" />
            <span>Visit on GitHub</span>
          </Button>
        </ItemActions>
        <CopyButton content={data.content} />
      </Item>
      <MDXContent source={data.content} />
    </div>
  )
}

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DestinationCard from "@/components/DestinationCard.vue";
import SmartImage from "@/components/SmartImage.vue";
import { destinations } from "@/data/destinations";
import NotFoundView from "@/views/NotFoundView.vue";

const routerLinkStub = {
  template: "<a><slot /></a>",
};

describe("shared components", () => {
  it("renders destination information and emits favorite changes", async () => {
    const destination = destinations[0];
    const wrapper = mount(DestinationCard, {
      props: {
        destination,
        favorite: false,
      },
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });

    expect(wrapper.text()).toContain(destination.name);
    expect(wrapper.text()).toContain(`${destination.recommendedDays} 天`);

    await wrapper.get(".favorite-button").trigger("click");
    expect(wrapper.emitted("toggle-favorite")?.[0]).toEqual([destination.id]);
  });

  it("replaces a failed remote image with an accessible placeholder", async () => {
    const wrapper = mount(SmartImage, {
      props: {
        src: "https://example.com/missing.jpg",
        alt: "测试风景",
      },
    });

    await wrapper.get("img").trigger("error");

    expect(wrapper.find("img").exists()).toBe(false);
    expect(wrapper.get('[role="img"]').attributes("aria-label")).toBe("测试风景");
    expect(wrapper.text()).toContain("图片暂不可用");
  });

  it("renders a useful not found state", () => {
    const wrapper = mount(NotFoundView, {
      global: {
        stubs: {
          RouterLink: routerLinkStub,
        },
      },
    });

    expect(wrapper.text()).toContain("这处风景暂时没有收录");
    expect(wrapper.text()).toContain("返回首页");
  });
});

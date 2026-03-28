import { DiffMethod, Toolkit } from "@aws-cdk/toolkit-lib";
import { ResourceImpact } from "@aws-cdk/cloudformation-diff";
import * as path from "path";

const cdkOutDir = path.join(__dirname, "..", "cdk.out");

void main();

interface Report {
  stackName: string;
  diffCount: number;
  logicalIds: string[];
}

async function main() {
  const toolkit = new Toolkit({
    color: false,
    emojis: false,

    // disables stdout so that we don't get the noisy default diff
    ioHost: {
      notify: async () => {},
      requestResponse: async (msg) => msg.defaultResponse,
    },
  });

  const assembly = await toolkit.fromAssemblyDirectory(cdkOutDir);

  const diff = await toolkit.diff(assembly, {
    method: DiffMethod.ChangeSet({
      fallbackToTemplate: false,
    }),
  });

  const report: Report[] = [];
  for (const [stackName, stackDiff] of Object.entries(diff)) {
    const removals = stackDiff.resources.filter(
      (diff) =>
        diff?.changeImpact === ResourceImpact.WILL_REPLACE ||
        diff?.changeImpact === ResourceImpact.WILL_DESTROY,
    );

    if (removals.differenceCount < 1) continue;

    report.push({
      stackName,
      diffCount: removals.differenceCount,
      logicalIds: removals.logicalIds,
    });
  }

  console.log(report);
}
